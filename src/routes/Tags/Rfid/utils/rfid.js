const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { logger } = require('../../../../middlewares');

async function validateRfid(rfid) {
    if (!rfid) {
        return new Error('RFID is required');
    }

    try {
        const tag = await prisma.rfidTag.findUnique({ where: { rfid } });

        if (tag) {
            await prisma.rfidTag.update({
                where: { rfid },
                data: { last_time_used: new Date(), used_times: { increment: 1 } },
            });
            if (tag.valid) {
                logger.info('RFID is valid, unlocking door');
                return true;
            } else {
                logger.info('RFID is invalid, door remains locked');
                return false;
            }
        }

        logger.warn('RFID not found, creating a new one');
        await prisma.rfidTag.create({ data: { rfid } });
        logger.info('New RFID created');

        return false;
    } catch (error) {
        logger.error('Error validating RFID:', error);
        return new Error('Error validating RFID');
    } finally {
        await prisma.$disconnect();
    }
}

async function removeRfid(rfid) {
    if (!rfid) {
        return new Error('RFID is required');
    }

    try {
        const removedRfid = await prisma.rfidTag.delete({ where: { rfid } });
        logger.info('RFID removed successfully');
        return removedRfid;
    } catch (error) {
        logger.error('Error removing RFID:', error);
        return new Error('Error removing RFID');
    } finally {
        await prisma.$disconnect();
    }
}

async function getAllRfids() {
    try {
        console.log('perto do banco')
        const rfids = await prisma.rfidTag.findMany();
        logger.info('Retrieved all RFIDs successfully');
        return rfids;
    } catch (error) {
        logger.error('Error retrieving RFIDs:', error);
        return new Error('Error retrieving RFIDs');
    } finally {
        await prisma.$disconnect();
    }
}

async function assignRfidToUser(rfid, userId) {
    if (!rfid || !userId) {
        return new Error('RFID and User ID are required');
    }

    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { tags_owned: { connect: { rfid } } },
        });

        await prisma.rfidTag.update({
            where: { rfid },
            data: {
                valid: true,
                user: { connect: { id: userId } },
            },
        });

        logger.info('RFID assigned to user successfully');
        return updatedUser;
    } catch (error) {
        logger.error('Error assigning RFID to user:', error);
        return new Error('Error assigning RFID to user');
    } finally {
        await prisma.$disconnect();
    }
}

module.exports = {
    validateRfid,
    removeRfid,
    getAllRfids,
    assignRfidToUser,
};

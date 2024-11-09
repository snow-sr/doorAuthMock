const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { logger } = require("../../../../middlewares");
const { dateFormat } = require("../../../../helpers/date/date");
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 864000, checkperiod: 3600 }); 

// Custom Error Classes
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
  }
}

async function validateRfid(rfid) {
  if (!rfid) {
    throw new ValidationError("RFID is required");
  }

  try {
    const cacheKey = `tag_rfid`;
 
    const cachedTags = cache.get(cacheKey);
   if (cachedTags) {
     const cachedTag = cachedTags.find((tag) => tag.rfid == rfid);
     if (cachedTag) {
       return cachedTag.valid;
     }
     else{
       return false
     }
   }

    const tags = await prisma.rfidTag.findMany();

    if(!tags){
      throw new NotFoundError("RFIDS not found");
    }

    const tagsToCache = tags

    cache.set(cacheKey, tagsToCache);

    
    console.log("passou")
    const tag = tags.find((tag) => tag.rfid == rfid);
    if (tag) {
      return tag.valid;
    }
  } catch (error) {
    return new Error(`Validation failed: ${error.message}`);
  } finally {
    await prisma.$disconnect();
  }
}

async function createRfid(rfid) {
  if (!rfid) {
    throw new ValidationError("RFID is required");
  }

  try {
    const newRfid = await prisma.rfidTag.create({ data: { rfid } });
    logger.info("RFID created successfully");
    return newRfid;
  } catch (error) {
    throw new Error(`Creation failed: ${error.message}`);
  } finally {
    await prisma.$disconnect();
  }
}
  

async function removeRfid(id) {
  if (!id) {
    throw new ValidationError("RFID is required");
  }

  try {
    const removedRfid = await prisma.rfidTag.delete({ where: { id: id } });
    logger.info("RFID removed successfully");
    return removedRfid;
  } catch (error) {
    throw new Error(`Removal failed: ${error.message}`);
  } finally {
    await prisma.$disconnect();
  }
}

async function getAllRfids() {
  try {
    const rfids = await prisma.rfidTag.findMany({
      include: { user: true },
    });
    rfids.forEach((rfid) => {
      rfid.created_at = dateFormat(rfid.created_at);
      rfid.last_time_used = dateFormat(rfid.last_time_used);
      rfid.updated_at = dateFormat(rfid.updated_at);
      if (rfid?.user){
        delete rfid.user.password;
      }
    });
    logger.info("Retrieved all RFIDs successfully");
    return rfids;
  } catch (error) {
    throw new Error(`Failed to retrieve RFIDs: ${error.message}`);
  } finally {
    await prisma.$disconnect();
  }
}

async function assignRfidToUser(rfid, userId) {
  if (!rfid || !userId) {
    throw new ValidationError("RFID and User ID are required");
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

    logger.info("RFID assigned to user successfully");
    return updatedUser;
  } catch (error) {
    throw new Error(`Failed to assign RFID: ${error.message}`);
  } finally {
    await prisma.$disconnect();
  }
}

async function desAssignRfidToUser(rfid, userId) {
  if (!rfid || !userId) {
    throw new ValidationError("RFID and User ID are required");
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { tags_owned: { disconnect: { rfid } } },
    });

    await prisma.rfidTag.update({
      where: { rfid },
      data: {
        valid: false,
        user: { disconnect: { id: userId } },
      },
    });

    logger.info("RFID desassigned to user successfully");
    return updatedUser;
  } catch (error) {
    throw new Error(`Failed to desassign RFID: ${error.message}`);
  } finally {
    await prisma.$disconnect();
  }
}

async function permissionRfid(rfid) {
  if (!rfid === undefined) {
    throw new ValidationError("RFID and valid are required");
  }

  try {
    console.log(rfid + ' dsadadAfgfuifWGFWFHEWQF')
    const tag = await prisma.rfidTag.findUnique({ where: { id: rfid } });
    const updatedRfid = await prisma.rfidTag.update({
      where: { id: rfid },
      data: { valid: !tag.valid },
    });

    logger.info("RFID permission updated successfully");
    return updatedRfid;
  } catch (error) {
    throw new Error(`Failed to update RFID permission: ${error.message}`);
  } finally {
    await prisma.$disconnect();
  }
}

module.exports = {
  validateRfid,
  removeRfid,
  getAllRfids,
  assignRfidToUser,
  permissionRfid,
  desAssignRfidToUser,
  createRfid,
};

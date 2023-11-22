var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export function checkRfid(rfid) {
    return __awaiter(this, void 0, void 0, function* () {
        const Exists = yield prisma.rfidTag.findUnique({
            where: {
                rfid: rfid,
            },
        });
        if (Exists) {
            prisma.$disconnect();
            return true;
        }
        else {
            prisma.$disconnect();
            return false;
        }
    });
}
export function createRfid(rfid) {
    return __awaiter(this, void 0, void 0, function* () {
        const rfidTag = yield prisma.rfidTag.create({
            data: {
                rfid: rfid,
                lastTimeUsed: new Date(),
            },
        });
        prisma.$disconnect();
        return rfidTag;
    });
}
export function deleteRfid(rfid) {
    return __awaiter(this, void 0, void 0, function* () {
        const rfidTag = yield prisma.rfidTag.delete({
            where: {
                rfid: rfid,
            },
        });
        prisma.$disconnect();
        return rfidTag;
    });
}
export function listAllRfids() {
    return __awaiter(this, void 0, void 0, function* () {
        const rfids = yield prisma.rfidTag.findMany();
        return rfids;
    });
}
export function listAllUser() {
    return __awaiter(this, void 0, void 0, function* () {
        const users = yield prisma.user.findMany();
        prisma.$disconnect();
        return users;
    });
}
// model user {
//   id        Int      @id @unique @default(autoincrement())
//   name      String
//   email     String   @unique
//   createdAt DateTime @default(now())
//   rfid      rfidTag?
// }
export function createUser(name, email) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield prisma.user.create({
            data: {
                name: name,
                email: email,
            },
        });
        prisma.$disconnect();
        return user;
    });
}
export function assignRfidToUser(rfid, email) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield prisma.user.update({
            where: {
                email: email,
            },
            data: {
                rfid: {
                    connect: {
                        rfid: rfid,
                    },
                },
            },
        });
        const rfidTag = yield prisma.rfidTag.update({
            where: {
                rfid: rfid,
            },
            data: {
                user: {
                    connect: {
                        email: email,
                    },
                },
            },
        });
        prisma.$disconnect();
        return user;
    });
}
//# sourceMappingURL=db.js.map
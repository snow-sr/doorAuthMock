import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function checkRfid(rfid: string) {
  const Exists = await prisma.rfidTag.findUnique({
    where: {
      rfid: rfid,
    },
  });

  if (Exists) {
    prisma.$disconnect();

    return true;
  } else {
    prisma.$disconnect();
    return false;
  }
}

export async function createRfid(rfid: string) {
  const rfidTag = await prisma.rfidTag.create({
    data: {
      rfid: rfid,
      lastTimeUsed: new Date(),
    },
  });

  prisma.$disconnect();

  return rfidTag;
}

export async function deleteRfid(rfid: string) {
  const rfidTag = await prisma.rfidTag.delete({
    where: {
      rfid: rfid,
    },
  });

  prisma.$disconnect();

  return rfidTag;
}

export async function listAllRfids() {
  const rfids = await prisma.rfidTag.findMany();
  return rfids;
}

export async function listAllUser() {
  const users = await prisma.user.findMany();

  prisma.$disconnect();

  return users;
}


// model user {
//   id        Int      @id @unique @default(autoincrement())
//   name      String
//   email     String   @unique
//   createdAt DateTime @default(now())
//   rfid      rfidTag?
// }


export async function createUser(name: string, email: string) {
  const user = await prisma.user.create({
    data: {
      name: name,
      email: email,
    },
  });

  prisma.$disconnect();

  return user;
}

export async function assignRfidToUser(rfid: string, email: string) {
  const user = await prisma.user.update({
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

  const rfidTag = await prisma.rfidTag.update({
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
}
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function checkRfid(rfid: string) {
  const Exists = await prisma.rfidTag.findUnique({
    where: {
      rfid: rfid,
    },
  });

  // update last time used
  await prisma.rfidTag.update({
    where: {
      rfid: rfid,
    },
    data: {
      last_time_used: new Date(),
    },
  });

  if (Exists.valid) {
    prisma.$disconnect();

    return true;
  } else {
    prisma.$disconnect();
    return false;
  }
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

export async function createUser(name: string, firebase_id: string) {
  const user = await prisma.user.create({
    data: {
      firebase_id: firebase_id,
      name: name,
    },
  });

  prisma.$disconnect();

  return user;
}

export async function assignRfidToUser(rfid: string, id: number) {
  const user = await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      tags_owned: {
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
          id: id,
        },
      },
    },
  });

  prisma.$disconnect();

  return user;
}

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


// ========================= USERS ============================== 
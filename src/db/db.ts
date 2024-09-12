import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function checkRfid(rfid: string) {
  try {
    const Exists = await prisma.rfidTag.findUnique({
      where: {
        rfid: rfid,
      },
    });

    if (Exists) {
      await prisma.rfidTag.update({
        where: {
          rfid: rfid,
        },
        data: {
          last_time_used: new Date(),
        },
      });

      if (Exists.valid) {
        console.log("destrancado");
        return true;
      } else {
        console.log(Exists);
        console.log("Minha Pomba Gira Rainha das 7 Encruzilhadas");
        console.log(Exists.valid);
        console.log("trancado");
        return false;
      }
    }

    console.log("ESSA PORRA EXISTE? ", Exists);

    if (!Exists) {
      console.log("Creating new rfid");
      await prisma.rfidTag.create({
        data: {
          rfid: rfid,
        },
      });

      console.log("Created");

      return false;
    }
  } finally {
    await prisma.$disconnect();
  }
}

export async function deleteRfid(rfid: string) {
  try {
    const rfidTag = await prisma.rfidTag.delete({
      where: {
        rfid: rfid,
      },
    });

    return rfidTag;
  } finally {
    await prisma.$disconnect();
  }
}

export async function listAllRfids() {
  try {
    const rfids = await prisma.rfidTag.findMany();
    return rfids;
  } finally {
    await prisma.$disconnect();
  }
}

export async function listAllUser() {
  try {
    const users = await prisma.user.findMany();
    return users;
  } finally {
    await prisma.$disconnect();
  }
}

export async function createUser(name: string, firebase_id: string) {
  try {
    const user = await prisma.user.create({
      data: {
        firebase_id: firebase_id,
        name: name,
      },
    });

    return user;
  } finally {
    await prisma.$disconnect();
  }
}

export async function assignRfidToUser(rfid: string, id: number) {
  try {
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
        valid: true,
        user: {
          connect: {
            id: id,
          },
        },
      },
    });

    return user;
  } finally {
    await prisma.$disconnect();
  }
}

export async function isUserSynced(firebaseUserID: string, name: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        firebase_id: firebaseUserID,
      },
    });

    if (user) {
      return true;
    } else {
      console.log("Creating new user");

      await prisma.user.create({
        data: {
          firebase_id: firebaseUserID,
          name: name,
        },
      });
      console.log("User created");
      return true;
    }
  } catch {
    console.log("Error creating user");
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

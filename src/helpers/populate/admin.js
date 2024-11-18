const s = require("dotenv").config({ path: ".env" });

s.error && console.error(s.error);
const bcrypt = require("bcrypt");

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    //  const salt = await bcrypt.genSalt(12);
    //  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);

     const createdUser = await prisma.user.update({
       where: { email: process.env.ADMIN_EMAIL },
         data: {
            isVerified: true,
            isSuper: true,
         },
     });
    console.log(`Usuário adm: ${createdUser.name}`);
  } catch (error) {
    console.error("Error fetching or inserting data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin()
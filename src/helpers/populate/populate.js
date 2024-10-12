const s = require("dotenv").config({ path: "../../../.env" });

s.error && console.error(s.error);

const { PrismaClient } = require("@prisma/client");
const axios = require("axios");

const prisma = new PrismaClient();

async function fetchDataAndPopulate() {
  try {
    const response = await axios.get(
      "https://api.github.com/orgs/fabricadesoftware-ifc/members"
    );
    const users = response.data;

    for (const [index, user] of users.entries()) {
      const { login } = user;

      const createdUser = await prisma.user.create({
        data: {
          name: login,
          email: `${login}@example.com`,
          password: "password123",
        },
      });

      console.log(`Usuário criado: ${createdUser.name}`);

      const isValid = index % 2 === 0;
      const createdTag = await prisma.rfidTag.create({
        data: {
          rfid: `RFID-${login}`,
          valid: isValid,
          user: {
            connect: { id: createdUser.id },
          },
        },
      });

      console.log(
        `Tag RFID criada: ${createdTag.rfid} - Válida: ${createdTag.valid}`
      );
    }
  } catch (error) {
    console.error("Error fetching or inserting data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fetchDataAndPopulate();

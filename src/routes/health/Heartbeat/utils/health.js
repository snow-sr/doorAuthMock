const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

class HealthError extends Error {
  constructor(message) {
    super(message);
    this.name = "HealthError";
  }
}

async function checkHealth() {
  try {
    await prisma.$connect();
    await prisma.$disconnect();
    return "OK";
  } catch (error) {
    throw new HealthError(`Health check failed: ${error.message}`);
  }
}

async function checkIp(ip){
    if(!ip){
        throw new ValidationError("Ip is required");
    }
    try{
        await prisma.ip.update({
            where: {
              id: 1
            },
            data: {
              ip: ip,
              updated_at: new Date()
            }
        });
    }
    catch(error){
        console.error(error);
        throw new HealthError(`Ip check failed: ${error.message}`);
    }
}

module.exports = { checkHealth, checkIp };
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();
const SECRET_KEY = 'manoPotassio';

export function generateToken(userId: number): string {
  return jwt.sign({ userId }, SECRET_KEY, { expiresIn: '1h' });
}

export async function registerUser(email: string, password: string, name:string) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });
  return user;
}
export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Senha incorreta');
  }

  const token = generateToken(user.id);
  return { token };
}

// Função para verificar o token JWT
export function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded;
  } catch (err) {
    throw new Error('Token inválido');
  }
}

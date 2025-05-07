import prisma from 'lib/prisma';
import { User } from '@prisma/client';

export const userService = {
  async getAllUsers(): Promise<User[]> {
    return await prisma.user.findMany();
  },

  async getUserById(id: number): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id },
    });
  },

  async createUser(data: { email: string; name?: string }): Promise<User> {
    return await prisma.user.create({
      data,
    });
  },

  async updateUser(id: number, data: { email?: string; name?: string }): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data,
    });
  },

  async deleteUser(id: number): Promise<User> {
    return await prisma.user.delete({
      where: { id },
    });
  },
};

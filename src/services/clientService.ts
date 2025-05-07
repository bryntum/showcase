import prisma from 'lib/prisma';
import type { Client } from '@prisma/client';

export const clientService = {
  async getAllClients(): Promise<Client[]> {
    return await prisma.client.findMany();
  },

  async getClientById(id: string): Promise<Client | null> {
    return await prisma.client.findUnique({
      where: { id },
    });
  },

  async createClient(data: {
    name: string;
  }): Promise<Client> {
    return await prisma.client.create({
      data,
    });
  },

  async updateClient(
    id: string,
    data: {
      name?: string;
    }
  ): Promise<Client> {
    return await prisma.client.update({
      where: { id },
      data,
    });
  },

  async deleteClient(id: string): Promise<Client> {
    return await prisma.client.delete({
      where: { id },
    });
  },
};

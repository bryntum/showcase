import prisma from 'lib/prisma';
import type { Depot } from '@prisma/client';

export const depotService = {
  async getAllDepots(): Promise<Depot[]> {
    return await prisma.depot.findMany({
      include: {
        vehicles: true,
      },
    });
  },

  async getDepotById(id: string): Promise<Depot | null> {
    return await prisma.depot.findUnique({
      where: { id },
      include: {
        vehicles: true,
      },
    });
  },

  async createDepot(data: {
    name: string;
    address: string;
  }): Promise<Depot> {
    return await prisma.depot.create({
      data,
      include: {
        vehicles: true,
      },
    });
  },

  async updateDepot(
    id: string,
    data: {
      name?: string;
      address?: string;
    }
  ): Promise<Depot> {
    return await prisma.depot.update({
      where: { id },
      data,
      include: {
        vehicles: true,
      },
    });
  },

  async deleteDepot(id: string): Promise<Depot> {
    return await prisma.depot.delete({
      where: { id },
    });
  },
};

import prisma from 'lib/prisma';
import { Item } from '@prisma/client';

export const itemService = {
  async getAllItems(): Promise<Item[]> {
    return await prisma.item.findMany();
  },

  async getItemById(id: string): Promise<Item | null> {
    return await prisma.item.findUnique({
      where: { id },
    });
  },

  async createItem(data: {
    name: string;
    description?: string;
    buyPrice: number;
    sellPrice: number;
    currency: string;
    weight: number;
  }): Promise<Item> {
    return await prisma.item.create({
      data,
    });
  },

  async updateItem(
    id: string,
    data: {
      name?: string;
      description?: string;
      buyPrice?: number;
      sellPrice?: number;
      currency?: string;
      weight?: number;
    }
  ): Promise<Item> {
    return await prisma.item.update({
      where: { id },
      data,
    });
  },

  async deleteItem(id: string): Promise<Item> {
    return await prisma.item.delete({
      where: { id },
    });
  },
};

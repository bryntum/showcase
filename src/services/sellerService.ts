import prisma from 'lib/prisma';
import { Seller } from '@prisma/client';

export const sellerService = {
  async getAllSellers(): Promise<Seller[]> {
    return await prisma.seller.findMany();
  },

  async getSellerById(id: string): Promise<Seller | null> {
    return await prisma.seller.findUnique({
      where: { id },
    });
  },

  async createSeller(data: {
    name: string;
  }): Promise<Seller> {
    return await prisma.seller.create({
      data,
    });
  },

  async updateSeller(
    id: string,
    data: {
      name?: string;
    }
  ): Promise<Seller> {
    return await prisma.seller.update({
      where: { id },
      data,
    });
  },

  async deleteSeller(id: string): Promise<Seller> {
    return await prisma.seller.delete({
      where: { id },
    });
  },
};

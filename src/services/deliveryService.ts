import prisma from 'lib/prisma';
import type { Delivery } from '@prisma/client';

export const deliveryService = {
  async getAllDeliveries(): Promise<Delivery[]> {
    return await prisma.delivery.findMany({
      include: {
        item: true,
        vehicle: true,
        driver: true,
        client: true,
        seller: true,
      },
    });
  },

  async getDeliveryById(id: string): Promise<Delivery | null> {
    return await prisma.delivery.findUnique({
      where: { id },
      include: {
        item: true,
        vehicle: true,
        driver: true,
        client: true,
        seller: true,
      },
    });
  },

  async createDelivery(data: {
    itemId: string;
    vehicleId?: string;
    driverId?: string;
    clientId?: string;
    sellerId?: string;
    type: string;
    plannedFrom?: Date;
    plannedTo?: Date;
    actualFrom?: Date;
    actualTo?: Date;
    comment?: string;
  }): Promise<Delivery> {
    return await prisma.delivery.create({
      data,
      include: {
        item: true,
        vehicle: true,
        driver: true,
        client: true,
        seller: true,
      },
    });
  },

  async updateDelivery(
    id: string,
    data: {
      itemId?: string;
      vehicleId?: string;
      driverId?: string;
      clientId?: string;
      sellerId?: string;
      type?: string;
      plannedFrom?: Date;
      plannedTo?: Date;
      actualFrom?: Date;
      actualTo?: Date;
      comment?: string;
    }
  ): Promise<Delivery> {
    return await prisma.delivery.update({
      where: { id },
      data,
      include: {
        item: true,
        vehicle: true,
        driver: true,
        client: true,
        seller: true,
      },
    });
  },

  async deleteDelivery(id: string): Promise<Delivery> {
    return await prisma.delivery.delete({
      where: { id },
    });
  },
};

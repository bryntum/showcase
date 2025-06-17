import prisma, { createRelationUpdate } from 'lib/prisma';
import type { Delivery } from '@prisma/client';

export const deliveryService = {
  async getAllDeliveries(): Promise<Delivery[]> {
    return await prisma.delivery.findMany({
      include: {
        item: true,
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
    durationInMinutes?: number;
    type: string;
    plannedFrom?: Date;
    actualFrom?: Date;
    comment?: string;
  }): Promise<Delivery> {
    return await prisma.delivery.create({
      data,
      include: {
        item: true,
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
      vehicleId?: string | null;
      driverId?: string | null;
      clientId?: string | null;
      sellerId?: string | null;
      durationInMinutes?: number;
      type?: string;
      plannedFrom?: Date;
      actualFrom?: Date;
      comment?: string;
    }
  ): Promise<Delivery> {
    const { itemId, vehicleId, driverId, clientId, sellerId, ...restData } = data;
    
    return await prisma.delivery.update({
      where: { id },
      data: {
        ...restData,
        item: itemId ? { connect: { id: itemId } } : undefined,
        driver: createRelationUpdate(driverId),
        client: createRelationUpdate(clientId),
        seller: createRelationUpdate(sellerId),
      },
      include: {
        item: true,
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

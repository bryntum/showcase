import prisma from 'lib/prisma';
import { Vehicle } from '@prisma/client';

export const vehicleService = {
  async getAllVehicles(): Promise<Vehicle[]> {
    return await prisma.vehicle.findMany({
      include: {
        depot: true,
      },
    });
  },

  async getVehicleById(id: string): Promise<Vehicle | null> {
    return await prisma.vehicle.findUnique({
      where: { id },
      include: {
        depot: true,
      },
    });
  },

  async createVehicle(data: {
    name: string;
    VINNumber?: string;
    depotId: string;
  }): Promise<Vehicle> {
    return await prisma.vehicle.create({
      data,
      include: {
        depot: true,
      },
    });
  },

  async updateVehicle(
    id: string,
    data: {
      name?: string;
      VINNumber?: string;
      depotId?: string;
    }
  ): Promise<Vehicle> {
    return await prisma.vehicle.update({
      where: { id },
      data,
      include: {
        depot: true,
      },
    });
  },

  async deleteVehicle(id: string): Promise<Vehicle> {
    return await prisma.vehicle.delete({
      where: { id },
    });
  },
};

import prisma from 'lib/prisma';
import { Driver } from '@prisma/client';

export const driverService = {
  async getAllDrivers(): Promise<Driver[]> {
    return await prisma.driver.findMany({
      include: {
        assignments: {
          include: {
            vehicle: true,
            trailer: true,
          }
        },
      }
    });
  },

  async getDriverById(id: string): Promise<Driver | null> {
    return await prisma.driver.findUnique({
      where: { id },
      include: {
        assignments: {
          include: {
            vehicle: true,
            trailer: true,
          }
        },
      }
    });
  },

  async createDriver(data: {
    name: string;
  }): Promise<Driver> {
    return await prisma.driver.create({
      data,
    });
  },

  async updateDriver(
    id: string,
    data: {
      name?: string;
    }
  ): Promise<Driver> {
    return await prisma.driver.update({
      where: { id },
      data,
    });
  },

  async deleteDriver(id: string): Promise<Driver> {
    return await prisma.driver.delete({
      where: { id },
    });
  },
};

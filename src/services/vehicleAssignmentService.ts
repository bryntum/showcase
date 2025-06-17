import prisma from 'lib/prisma';
import { VehicleAssignment } from '@prisma/client';

export const vehicleAssignmentService = {
  async getAllVehicleAssignments(): Promise<VehicleAssignment[]> {
    return await prisma.vehicleAssignment.findMany({
      include: {
        vehicle: true,
        trailer: true,
        driver: true,
      },
    });
  },

  async getVehicleAssignmentById(id: string): Promise<VehicleAssignment | null> {
    return await prisma.vehicleAssignment.findUnique({
      where: { id },
      include: {
        vehicle: true,
        trailer: true,
        driver: true,
      },
    });
  },

  async createVehicleAssignment(data: {
    vehicleId: string;
    trailerId: string;
    driverId: string;
    date: Date;
  }): Promise<VehicleAssignment> {
    return await prisma.vehicleAssignment.create({
      data,
      include: {
        vehicle: true,
        trailer: true,
        driver: true,
      },
    });
  },

  async updateVehicleAssignment(
    id: string,
    data: {
      vehicleId?: string;
      trailerId?: string;
      driverId?: string;
      date?: Date;
    }
  ): Promise<VehicleAssignment> {
    return await prisma.vehicleAssignment.update({
      where: { id },
      data,
      include: {
        vehicle: true,
        trailer: true,
        driver: true,
      },
    });
  },

  async deleteVehicleAssignment(id: string): Promise<VehicleAssignment> {
    return await prisma.vehicleAssignment.delete({
      where: { id },
    });
  },

  async getVehicleAssignmentsByDate(date: Date): Promise<VehicleAssignment[]> {
    return await prisma.vehicleAssignment.findMany({
      where: {
        date: {
          gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
          lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1),
        },
      },
      include: {
        vehicle: true,
        trailer: true,
        driver: true,
      },
    });
  },

  async getVehicleAssignmentsByVehicle(vehicleId: string): Promise<VehicleAssignment[]> {
    return await prisma.vehicleAssignment.findMany({
      where: { vehicleId },
      include: {
        vehicle: true,
        trailer: true,
        driver: true,
      },
    });
  },

  async getVehicleAssignmentsByDriver(driverId: string): Promise<VehicleAssignment[]> {
    return await prisma.vehicleAssignment.findMany({
      where: { driverId },
      include: {
        vehicle: true,
        trailer: true,
        driver: true,
      },
    });
  },
};

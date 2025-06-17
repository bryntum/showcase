import prisma from 'lib/prisma';
import { Trailer } from '@prisma/client';

export const trailerService = {
  async getAllTrailers(): Promise<Trailer[]> {
    return await prisma.trailer.findMany({
      include: {
        depot: true,
        assignments: true,
      },
    });
  },

  async getTrailerById(id: string): Promise<Trailer | null> {
    return await prisma.trailer.findUnique({
      where: { id },
      include: {
        depot: true,
        assignments: true,
      },
    });
  },

  async createTrailer(data: {
    name: string;
    VINNumber?: string;
    depotId: string;
  }): Promise<Trailer> {
    return await prisma.trailer.create({
      data,
      include: {
        depot: true,
        assignments: true,
      },
    });
  },

  async updateTrailer(
    id: string,
    data: {
      name?: string;
      VINNumber?: string;
      depotId?: string;
    }
  ): Promise<Trailer> {
    return await prisma.trailer.update({
      where: { id },
      data,
      include: {
        depot: true,
        assignments: true,
      },
    });
  },

  async deleteTrailer(id: string): Promise<Trailer> {
    return await prisma.trailer.delete({
      where: { id },
    });
  },
};

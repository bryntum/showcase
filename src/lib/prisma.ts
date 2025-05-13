
import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

type RelationUpdate = { connect: { id: string } } | { disconnect: true } | undefined;

export const createRelationUpdate = (id: string | null | undefined): RelationUpdate => {
  if (id === undefined) return undefined;
  return id === null ? { disconnect: true } : { connect: { id } };
};

export default prisma;

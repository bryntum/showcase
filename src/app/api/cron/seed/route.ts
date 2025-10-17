import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";
import { runSeed } from "../../../../lib/seed-utils";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Verify this is a legitimate cron request by checking the Authorization header
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Starting database seeding via cron job...');

    // Run the seed function directly
    await runSeed(prisma);

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error running seed:', error);

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET(request: NextRequest) {
  try {
    // Verify this is a legitimate cron request by checking the Authorization header
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Starting database seeding via cron job...');

    // Run the seed command
    const { stdout, stderr } = await execAsync('npm run seed');

    console.log('Seed command output:', stdout);
    if (stderr) {
      console.error('Seed command errors:', stderr);
    }

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      timestamp: new Date().toISOString(),
      output: stdout
    });

  } catch (error) {
    console.error('Error running seed command:', error);

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

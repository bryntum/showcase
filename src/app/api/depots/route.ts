import { NextResponse } from 'next/server';
import { depotService } from 'services/depotService';
import { validateRequest } from 'lib/validation';

export async function GET() {
  try {
    const depots = await depotService.getAllDepots();
    return NextResponse.json(depots);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch depots' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const validationError = validateRequest(data, ['name', 'location']);
    if (validationError) return validationError;

    const depot = await depotService.createDepot(data);
    return NextResponse.json(depot);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create depot' }, { status: 500 });
  }
} 
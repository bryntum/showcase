import { NextResponse } from 'next/server';
import { driverService } from 'services/driverService';
import { validateRequest } from 'lib/validation';

export async function GET() {
  try {
    const drivers = await driverService.getAllDrivers();
    return NextResponse.json(drivers);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch drivers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const validationError = validateRequest(data, ['name', 'licenseNumber']);
    if (validationError) return validationError;

    const driver = await driverService.createDriver(data);
    return NextResponse.json(driver);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create driver' }, { status: 500 });
  }
} 
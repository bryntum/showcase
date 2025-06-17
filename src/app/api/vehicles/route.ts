import { NextResponse } from 'next/server';
import { vehicleService } from 'services/vehicleService';
import { validateRequest } from 'lib/validation';

export async function GET() {
  try {
    const vehicles = await vehicleService.getAllVehicles();
    return NextResponse.json(vehicles);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch vehicles' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const validationError = validateRequest(data, ['name', 'VINNumber', 'model', 'depotId']);
    if (validationError) return validationError;

    const vehicle = await vehicleService.createVehicle(data);
    return NextResponse.json(vehicle);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create vehicle' }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { vehicleService } from 'services/vehicleService';
import { validateRequest } from 'lib/validation';

export const GET = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const vehicle = await vehicleService.getVehicleById(id);
    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }
    return NextResponse.json(vehicle);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch vehicle' }, { status: 500 });
  }
}

export const PUT = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const data = await request.json();
    const validationError = validateRequest(data, []);
    if (validationError) return validationError;

    const vehicle = await vehicleService.updateVehicle(id, data);
    return NextResponse.json(vehicle);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update vehicle' }, { status: 500 });
  }
}

export const DELETE = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    await vehicleService.deleteVehicle(id);
    return NextResponse.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete vehicle' }, { status: 500 });
  }
}
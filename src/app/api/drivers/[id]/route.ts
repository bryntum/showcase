import { NextResponse } from 'next/server';
import { driverService } from 'services/driverService';
import { validateRequest } from 'lib/validation';

export const GET = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {  
  try {
    const { id } = await params;
    const driver = await driverService.getDriverById(id);
    if (!driver) {
      return NextResponse.json({ error: 'Driver not found' }, { status: 404 });
    }
    return NextResponse.json(driver);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch driver' }, { status: 500 });
  }
}

export const PUT = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const data = await request.json();
    const validationError = validateRequest(data, ['name', 'licenseNumber']);
    if (validationError) return validationError;

    const driver = await driverService.updateDriver(id, data);
    return NextResponse.json(driver);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update driver' }, { status: 500 });
  }
}

export const DELETE = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    await driverService.deleteDriver(id);
    return NextResponse.json({ message: 'Driver deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete driver' }, { status: 500 });
  }
} 
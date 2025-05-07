import { NextResponse } from 'next/server';
import { driverService } from 'services/driverService';
import { validateRequest } from 'lib/validation';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const driver = await driverService.getDriverById(params.id);
    if (!driver) {
      return NextResponse.json({ error: 'Driver not found' }, { status: 404 });
    }
    return NextResponse.json(driver);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch driver' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const validationError = validateRequest(data, ['name', 'licenseNumber']);
    if (validationError) return validationError;

    const driver = await driverService.updateDriver(params.id, data);
    return NextResponse.json(driver);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update driver' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await driverService.deleteDriver(params.id);
    return NextResponse.json({ message: 'Driver deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete driver' }, { status: 500 });
  }
} 
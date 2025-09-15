import { NextResponse } from 'next/server';
import { vehicleAssignmentService } from 'services/vehicleAssignmentService';
import { validateRequest } from 'lib/validation';

export const GET = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const vehicleAssignment = await vehicleAssignmentService.getVehicleAssignmentById(id);
    if (!vehicleAssignment) {
      return NextResponse.json({ error: 'Vehicle assignment not found' }, { status: 404 });
    }
    return NextResponse.json(vehicleAssignment);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch vehicle assignment' }, { status: 500 });
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

    const vehicleAssignment = await vehicleAssignmentService.updateVehicleAssignment(id, data);
    return NextResponse.json(vehicleAssignment);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update vehicle assignment' }, { status: 500 });
  }
}

export const DELETE = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    await vehicleAssignmentService.deleteVehicleAssignment(id);
    return NextResponse.json({ message: 'Vehicle assignment deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete vehicle assignment' }, { status: 500 });
  }
}

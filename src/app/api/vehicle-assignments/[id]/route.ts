import { NextResponse } from 'next/server';
import { vehicleAssignmentService } from 'services/vehicleAssignmentService';
import { validateRequest } from 'lib/validation';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const vehicleAssignment = await vehicleAssignmentService.getVehicleAssignmentById(params.id);
    if (!vehicleAssignment) {
      return NextResponse.json({ error: 'Vehicle assignment not found' }, { status: 404 });
    }
    return NextResponse.json(vehicleAssignment);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch vehicle assignment' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const validationError = validateRequest(data, []);
    if (validationError) return validationError;

    const vehicleAssignment = await vehicleAssignmentService.updateVehicleAssignment(params.id, data);
    return NextResponse.json(vehicleAssignment);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update vehicle assignment' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await vehicleAssignmentService.deleteVehicleAssignment(params.id);
    return NextResponse.json({ message: 'Vehicle assignment deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete vehicle assignment' }, { status: 500 });
  }
}

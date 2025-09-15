import { NextResponse } from 'next/server';
import { vehicleAssignmentService } from 'services/vehicleAssignmentService';
import { validateRequest } from 'lib/validation';

export const GET = async () => {
  try {
    const vehicleAssignments = await vehicleAssignmentService.getAllVehicleAssignments();
    return NextResponse.json(vehicleAssignments);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch vehicle assignments' }, { status: 500 });
  }
}

export const POST = async (request: Request) => {
  try {
    const data = await request.json();
    const validationError = validateRequest(data, ['driverId', 'date']);
    if (validationError) return validationError;

    const vehicleAssignment = await vehicleAssignmentService.createVehicleAssignment(data);
    return NextResponse.json(vehicleAssignment);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create vehicle assignment' }, { status: 500 });
  }
}

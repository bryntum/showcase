import { NextResponse } from 'next/server';
import { depotService } from 'services/depotService';
import { validateRequest } from 'lib/validation';

export const GET = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const depot = await depotService.getDepotById(id);
    if (!depot) {
      return NextResponse.json({ error: 'Depot not found' }, { status: 404 });
    }
    return NextResponse.json(depot);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch depot' }, { status: 500 });
  }
}

export const PUT = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const data = await request.json();
    const validationError = validateRequest(data, ['name', 'location']);
    if (validationError) return validationError;

    const depot = await depotService.updateDepot(id, data);
    return NextResponse.json(depot);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update depot' }, { status: 500 });
  }
}

export const DELETE = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    await depotService.deleteDepot(id);
    return NextResponse.json({ message: 'Depot deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete depot' }, { status: 500 });
  }
} 
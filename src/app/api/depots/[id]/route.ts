import { NextResponse } from 'next/server';
import { depotService } from 'services/depotService';
import { validateRequest } from 'lib/validation';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const depot = await depotService.getDepotById(params.id);
    if (!depot) {
      return NextResponse.json({ error: 'Depot not found' }, { status: 404 });
    }
    return NextResponse.json(depot);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch depot' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const validationError = validateRequest(data, ['name', 'location']);
    if (validationError) return validationError;

    const depot = await depotService.updateDepot(params.id, data);
    return NextResponse.json(depot);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update depot' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await depotService.deleteDepot(params.id);
    return NextResponse.json({ message: 'Depot deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete depot' }, { status: 500 });
  }
} 
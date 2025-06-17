import { NextResponse } from 'next/server';
import { trailerService } from 'services/trailerService';
import { validateRequest } from 'lib/validation';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const trailer = await trailerService.getTrailerById(params.id);
    if (!trailer) {
      return NextResponse.json({ error: 'Trailer not found' }, { status: 404 });
    }
    return NextResponse.json(trailer);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch trailer' }, { status: 500 });
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

    const trailer = await trailerService.updateTrailer(params.id, data);
    return NextResponse.json(trailer);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update trailer' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await trailerService.deleteTrailer(params.id);
    return NextResponse.json({ message: 'Trailer deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete trailer' }, { status: 500 });
  }
}

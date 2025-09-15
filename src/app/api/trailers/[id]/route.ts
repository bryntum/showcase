import { NextResponse } from 'next/server';
import { trailerService } from 'services/trailerService';
import { validateRequest } from 'lib/validation';

export const GET = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const trailer = await trailerService.getTrailerById(id);
    if (!trailer) {
      return NextResponse.json({ error: 'Trailer not found' }, { status: 404 });
    }
    return NextResponse.json(trailer);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch trailer' }, { status: 500 });
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

    const trailer = await trailerService.updateTrailer(id, data);
    return NextResponse.json(trailer);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update trailer' }, { status: 500 });
  }
}

export const DELETE = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    await trailerService.deleteTrailer(id);
    return NextResponse.json({ message: 'Trailer deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete trailer' }, { status: 500 });
  }
}

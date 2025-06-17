import { NextResponse } from 'next/server';
import { trailerService } from 'services/trailerService';
import { validateRequest } from 'lib/validation';

export async function GET() {
  try {
    const trailers = await trailerService.getAllTrailers();
    return NextResponse.json(trailers);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch trailers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const validationError = validateRequest(data, ['name', 'VINNumber', 'depotId']);
    if (validationError) return validationError;

    const trailer = await trailerService.createTrailer(data);
    return NextResponse.json(trailer);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create trailer' }, { status: 500 });
  }
}

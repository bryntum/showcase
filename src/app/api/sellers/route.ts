import { NextResponse } from 'next/server';
import { sellerService } from 'services/sellerService';
import { validateRequest } from 'lib/validation';

export const GET = async () => {
  try {
    const sellers = await sellerService.getAllSellers();
    return NextResponse.json(sellers);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch sellers' }, { status: 500 });
  }
}

export const POST = async (request: Request) => {
  try {
    const data = await request.json();
    const validationError = validateRequest(data, ['name', 'email']);
    if (validationError) return validationError;

    const seller = await sellerService.createSeller(data);
    return NextResponse.json(seller);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create seller' }, { status: 500 });
  }
} 
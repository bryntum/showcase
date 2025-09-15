import { NextResponse } from 'next/server';
import { sellerService } from 'services/sellerService';
import { validateRequest } from 'lib/validation';

export const GET = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const seller = await sellerService.getSellerById(id);
    if (!seller) {
      return NextResponse.json({ error: 'Seller not found' }, { status: 404 });
    }
    return NextResponse.json(seller);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch seller' }, { status: 500 });
  }
}

export const PUT = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const data = await request.json();
    const validationError = validateRequest(data, ['name', 'email']);
    if (validationError) return validationError;

    const seller = await sellerService.updateSeller(id, data);
    return NextResponse.json(seller);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update seller' }, { status: 500 });
  }
}

export const DELETE = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    await sellerService.deleteSeller(id);
    return NextResponse.json({ message: 'Seller deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete seller' }, { status: 500 });
  }
} 
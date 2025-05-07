import { NextResponse } from 'next/server';
import { sellerService } from 'services/sellerService';
import { validateRequest } from 'lib/validation';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const seller = await sellerService.getSellerById(params.id);
    if (!seller) {
      return NextResponse.json({ error: 'Seller not found' }, { status: 404 });
    }
    return NextResponse.json(seller);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch seller' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const validationError = validateRequest(data, ['name', 'email']);
    if (validationError) return validationError;

    const seller = await sellerService.updateSeller(params.id, data);
    return NextResponse.json(seller);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update seller' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await sellerService.deleteSeller(params.id);
    return NextResponse.json({ message: 'Seller deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete seller' }, { status: 500 });
  }
} 
import { NextResponse } from 'next/server';
import { itemService } from 'services/itemService';
import { validateRequest } from 'lib/validation';

export const GET = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const item = await itemService.getItemById(id);
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch item' }, { status: 500 });
  }
}

export const PUT = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const data = await request.json();
    const validationError = validateRequest(data, ['name', 'price']);
    if (validationError) return validationError;

    const item = await itemService.updateItem(id, data);
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}

export const DELETE = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {  
  try {
    const { id } = await params;
    await itemService.deleteItem(id);
    return NextResponse.json({ message: 'Item deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
} 
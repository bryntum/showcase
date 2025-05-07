import { NextResponse } from 'next/server';
import { itemService } from 'services/itemService';
import { validateRequest } from 'lib/validation';

export async function GET() {
  try {
    const items = await itemService.getAllItems();
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const validationError = validateRequest(data, ['name', 'price']);
    if (validationError) return validationError;

    const item = await itemService.createItem(data);
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 });
  }
} 
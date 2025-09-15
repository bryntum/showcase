import { NextResponse } from 'next/server';
import { deliveryService } from 'services/deliveryService';

export const GET = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const delivery = await deliveryService.getDeliveryById(id);
    if (!delivery) {
      return NextResponse.json({ error: 'Delivery not found' }, { status: 404 });
    }
    return NextResponse.json(delivery);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch delivery' }, { status: 500 });
  }
}

export const PUT = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const data = await request.json();
    const delivery = await deliveryService.updateDelivery(id, data);
    return NextResponse.json(delivery);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update delivery' }, { status: 500 });
  }
}

export const DELETE = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    await deliveryService.deleteDelivery(id);
    return NextResponse.json({ message: 'Delivery deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete delivery' }, { status: 500 });
  }
}
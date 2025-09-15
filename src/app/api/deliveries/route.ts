import { NextResponse } from 'next/server';
import { deliveryService } from 'services/deliveryService';

export const GET = async () => {
  try {
    const deliveries = await deliveryService.getAllDeliveries();
    return NextResponse.json(deliveries);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch deliveries' }, { status: 500 });
  }
}

export const POST = async (request: Request) => {
  try {
    const data = await request.json();
    const delivery = await deliveryService.createDelivery(data);
    return NextResponse.json(delivery);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create delivery' }, { status: 500 });
  }
} 
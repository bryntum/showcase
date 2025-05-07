import { NextResponse } from 'next/server';
import { clientService } from 'services/clientService';
import { validateRequest } from 'lib/validation';

export async function GET() {
  try {
    const clients = await clientService.getAllClients();
    return NextResponse.json(clients);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const validationError = validateRequest(data, ['name', 'email', 'phone']);
    if (validationError) return validationError;

    const client = await clientService.createClient(data);
    return NextResponse.json(client);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create client' }, { status: 500 });
  }
} 
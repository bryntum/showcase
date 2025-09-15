import { NextResponse } from 'next/server';
import { clientService } from 'services/clientService';
import { validateRequest } from 'lib/validation';

export const GET = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> } 
) => {
  try {
    const { id } = await params;
    const client = await clientService.getClientById(id);
    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }
    return NextResponse.json(client);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch client' }, { status: 500 });
  }
}

export const PUT = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const data = await request.json();
    const validationError = validateRequest(data, ['name', 'email', 'phone']);
    if (validationError) return validationError;

    const client = await clientService.updateClient(id, data);
    return NextResponse.json(client);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update client' }, { status: 500 });
  }
}

export const DELETE = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    await clientService.deleteClient(id);
    return NextResponse.json({ message: 'Client deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete client' }, { status: 500 });
  }
} 
import { NextResponse } from 'next/server';
import { userService } from 'services/userService';
import { validateRequest } from 'lib/validation';

export const GET = async () => {
  try {
    const users = await userService.getAllUsers();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export const POST = async (request: Request) => {
  try {
    const data = await request.json();
    const validationError = validateRequest(data, ['email', 'name']);
    if (validationError) return validationError;

    const user = await userService.createUser(data);
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
} 
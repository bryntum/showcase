import { NextResponse } from 'next/server';

export function validateRequest(data: Record<string, unknown>, requiredFields: string[]) {
  const missingFields = requiredFields.filter(field => !data[field]);
  
  if (missingFields.length > 0) {
    return NextResponse.json(
      { error: `Missing required fields: ${missingFields.join(', ')}` },
      { status: 400 }
    );
  }
  
  return null;
} 
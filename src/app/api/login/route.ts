import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const { username, password } = await req.json();

  // 1. Add your logic to verify credentials from database here
  if (username === 'admin' && password === 'password123') {
    
    // 2. This creates the 'auth_token' cookie in the browser
    (await cookies()).set('auth_token', '27', {
      httpOnly: true, // Crucial for security: prevents JS from accessing the cookie
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return NextResponse.json({ message: 'Login successful' });
  }

  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}
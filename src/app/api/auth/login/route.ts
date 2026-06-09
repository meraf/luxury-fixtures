import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma'; 

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    console.log("Attempting login for:", email); // Check your terminal!

const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log("User not found in prisma");
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // IMPORTANT: Are you using hashed passwords? 
    // If you are just starting, compare plain text first to test:
    if (user.password !== password) {
      console.log("Password mismatch");
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    return NextResponse.json({ user: { name: user.name, email: user.email } });
  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
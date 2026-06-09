import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Prevent multiple instances of Prisma Client in development
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// --- GET: Fetch all staff members ---
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        id: 'asc',
      },
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch staff members.' },
      { status: 500 }
    );
  }
}

// --- POST: Add a new staff member ---
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, role, password } = body;

    // Basic validation
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required fields.' },
        { status: 400 }
      );
    }

    // Create entry in database matching required schema fields
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        role: role || 'CASHIER',
        // Fallback placeholder handles your schema's required password requirement
        password: password || 'WelcomeLuxury123!', 
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error: any) {
    console.error('Database write error:', error);

    // Handle Prisma unique constraint violation (e.g., duplicate email)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A user with this email already exists.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to record internal database entry.' },
      { status: 500 }
    );
  }
}

// --- DELETE: Remove a staff member ---
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idString = searchParams.get('id');

    if (!idString) {
      return NextResponse.json(
        { error: 'User ID parameter is missing.' },
        { status: 400 }
      );
    }

    const id = parseInt(idString, 10);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid User ID format.' },
        { status: 400 }
      );
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error('Database delete error:', error);
    return NextResponse.json(
      { error: 'Could not remove database entry.' },
      { status: 500 }
    );
  }
}
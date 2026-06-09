// app/api/categories/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Reuse your existing prisma client instance logic here
const prisma = new PrismaClient();

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error("Categories API Error:", error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}
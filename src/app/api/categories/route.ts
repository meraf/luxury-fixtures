// app/api/categories/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Retrieve all categories
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

// POST: Create a new category
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    const newCategory = await prisma.category.create({
      data: {
        name: name,
      },
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error: any) {
    console.error("Categories API POST Error:", error);
    
    // Specifically catch Prisma unique constraint errors (e.g., duplicate name)
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'A category with this name already exists' }, { status: 409 });
    }

    return NextResponse.json({ error: 'Failed to save category' }, { status: 500 });
  }
}
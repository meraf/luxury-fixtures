import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// --- GET: Fetch all active products ---
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { id: 'desc' }
    });
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("GET Product Error:", error);
    return NextResponse.json({ error: 'Failed to fetch directory data.' }, { status: 500 });
  }
}

// --- POST: Create new product ---
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sku, name, description, image, costPrice, sellingPrice, shopStock, categoryId } = body;

    // Strict validation
    if (!sku || !name || !image || !costPrice || !sellingPrice || !categoryId) {
      return NextResponse.json({ error: 'Missing required product attributes.' }, { status: 400 });
    }

    // Insert into PostgreSQL
    const newProduct = await prisma.product.create({
      data: {
        sku,
        name,
        description: description || null,
        image, 
        costPrice: Number(costPrice),
        sellingPrice: Number(sellingPrice),
        shopStock: Number(shopStock) || 0,
        warehouseStock: 0, // Explicitly isolated initialization block
        status: "ACTIVE",
        categoryId: Number(categoryId),
      },
    });

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (error: any) {
    console.error("POST Product Error:", error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: `The SKU "${error.meta?.target}" already exists.` }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// --- PATCH: Restock existing product ---
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { productId, quantityToAdd } = body;

    if (!productId || !quantityToAdd) {
      return NextResponse.json({ error: 'Missing restock parameters.' }, { status: 400 });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: Number(productId) },
      data: { shopStock: { increment: Number(quantityToAdd) } }
    });

    return NextResponse.json({ success: true, updatedStock: updatedProduct.shopStock }, { status: 200 });
  } catch (error) {
    console.error("PATCH Product Error:", error);
    return NextResponse.json({ error: 'Failed to update Store storage allocation.' }, { status: 500 });
  }
}
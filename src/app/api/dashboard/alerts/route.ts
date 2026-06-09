import { NextResponse } from 'next/server';
import { prisma as db } from './../../../../lib/prisma';

export async function GET() {
  try {
    const lowStockItems = await db.product.findMany({
      where: {
        shopStock: { lt: 5 }, // Items with less than 5 in the shop
        status: 'ACTIVE'
      },
      select: {
        id: true,
        name: true,
        shopStock: true,
        sku: true
      }
    });
    return NextResponse.json(lowStockItems);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch alerts" }, { status: 500 });
  }
}
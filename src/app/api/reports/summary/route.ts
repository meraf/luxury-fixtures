import { NextResponse } from 'next/server';
import { prisma as db } from '../../../../lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const period = searchParams.get('period') || 'daily'; // daily, monthly, yearly

    // FIX: Removed "cashier: true" because it is a string now, not an object relation
    const sales = await db.sale.findMany({
      include: { 
        items: { include: { product: true } } 
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(sales);
  } catch (error) {
    console.error("Error loading periodic sales:", error);
    return NextResponse.json({ error: "Failed to load sales data" }, { status: 500 });
  }
}
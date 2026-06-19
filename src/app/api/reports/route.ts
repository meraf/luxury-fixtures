import { NextResponse } from 'next/server';
import { prisma as db } from '../../../lib/prisma';

export async function GET() {
  try {
    // FIX: Removed "cashier: true" from include
    const sales = await db.sale.findMany({
      include: { 
        items: { include: { product: true } } 
      },
      orderBy: { createdAt: 'desc' }
    });

    // MAKE SURE THIS KEY MATCHES WHAT YOU USE IN DashboardView
    return NextResponse.json({ recentSales: sales });
  } catch (error) {
    console.error("Reports API error:", error);
    return NextResponse.json({ error: "Failed to load recent sales history" }, { status: 500 });
  }
}
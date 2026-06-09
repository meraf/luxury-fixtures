// src/app/api/reports/route.ts
import { NextResponse } from 'next/server';
import { prisma as db } from '../../../lib/prisma';

export async function GET() {
  try {
    const sales = await db.sale.findMany({
      include: { 
        cashier: true, 
        items: { include: { product: true } } 
      },
      orderBy: { createdAt: 'desc' }
    });

    // MAKE SURE THIS KEY MATCHES WHAT YOU USE IN DashboardView
    return NextResponse.json({ recentSales: sales });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
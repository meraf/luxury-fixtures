import { NextResponse } from 'next/server';
import { prisma as db } from '../../../../lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const period = searchParams.get('period') || 'daily'; // daily, monthly, yearly

  // Logic to group sales based on period
  // For 'daily', we fetch all sales with full relations
  const sales = await db.sale.findMany({
    include: { 
      cashier: true, 
      items: { include: { product: true } } 
    },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json(sales);
}
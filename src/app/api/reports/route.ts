import { NextResponse } from 'next/server';
import { prisma as db} from '../../../lib/prisma'; // Adjust the path as needed

export async function GET() {
  try {
    // Example: Aggregate total sales and profit
    const totals = await db.sale.aggregate({
      _sum: { total: true, profit: true },
    });

    // Fetch recent sales with details for the dashboard list
    const recentSales = await db.sale.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { 
        cashier: { select: { name: true } }, 
        items: { include: { product: true } } 
      },
    });

    return NextResponse.json({ totals, recentSales });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
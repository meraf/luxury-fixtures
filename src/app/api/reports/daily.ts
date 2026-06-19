import { NextResponse } from 'next/server';
import { prisma as db } from '../../../lib/prisma';

export async function GET() {
  try {
    // Get last 7 days of sales
    const sales = await db.sale.findMany({
      take: 7,
      orderBy: { createdAt: 'desc' },
    });

    // Map/format the data for Recharts
    const chartData = sales.map(s => ({
      date: new Date(s.createdAt).toLocaleDateString(),
      total: s.total,
      profit: s.profit
    })).reverse();

    return NextResponse.json(chartData);
  } catch (error) {
    console.error("Chart data error:", error);
    return NextResponse.json({ error: "Failed to load report" }, { status: 500 });
  }
}
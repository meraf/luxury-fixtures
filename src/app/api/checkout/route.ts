import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { cart, userId } = await req.json();

    // Calculate totals
    const totalAmount = cart.reduce((sum: number, item: any) => 
      sum + (Number(item.price) * Number(item.quantity)), 0
    );

    // Calculate profit (assuming costPrice is available in your product object)
    const totalProfit = cart.reduce((sum: number, item: any) => 
      sum + ((Number(item.price) - Number(item.product.costPrice)) * Number(item.quantity)), 0
    );

    const result = await prisma.$transaction(async (tx) => {
      // 1. Create the Sale (for your Reports)
      const sale = await tx.sale.create({
        data: {
          total: totalAmount,
          profit: totalProfit,
          cashierId: Number(userId),
          items: {
            create: cart.map((item: any) => ({
              productId: Number(item.product.id),
              quantity: Number(item.quantity),
              price: Number(item.price),
              stockSource: item.stockSource
            }))
          }
        }
      });

      // 2. Update stock levels
      for (const item of cart) {
        const field = item.stockSource === 'SHOP' ? 'shopStock' : 'warehouseStock';
        await tx.product.update({
          where: { id: Number(item.product.id) },
          data: { [field]: { decrement: Number(item.quantity) } }
        });
      }

      return sale;
    });

    return NextResponse.json({ success: true, saleId: result.id });
  } catch (error) {
    console.error("Checkout transaction error:", error);
    return NextResponse.json(
      { error: 'Transaction failed', details: error instanceof Error ? error.message : 'Unknown' }, 
      { status: 500 }
    );
  }
}
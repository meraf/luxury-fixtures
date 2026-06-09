import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { cart, userId } = await req.json();

    const totalAmount = cart.reduce((sum: number, item: any) => 
      sum + (Number(item.price) * Number(item.quantity)), 0
    );

    const result = await prisma.$transaction(async (tx) => {
      // 1. Verify User exists (Do not try to create them if they don't exist)
      const user = await tx.user.findUnique({ where: { id: Number(userId) } });
      
      if (!user) {
        throw new Error(`User with ID ${userId} not found.`);
      }

      // 2. Create the Order
      const order = await tx.order.create({
        data: {
          totalAmount: totalAmount,
          userId: user.id,
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

      // 3. Update stock
      for (const item of cart) {
        const field = item.stockSource === 'SHOP' ? 'shopStock' : 'warehouseStock';
        await tx.product.update({
          where: { id: Number(item.product.id) },
          data: { [field]: { decrement: Number(item.quantity) } }
        });
      }

      return order;
    });

    return NextResponse.json({ success: true, orderId: result.id });
  } catch (error) {
    console.error("Checkout transaction error:", error);
    return NextResponse.json(
      { error: 'Transaction failed', details: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
}
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const cart = await req.json();
  
  try {
    // Use a transaction so all updates happen or none do
    await prisma.$transaction(
      cart.map((item: any) => {
        if (item.stockSource === 'SHOP') {
          return prisma.product.update({
            where: { id: item.product.id },
            data: { shopStock: { decrement: item.quantity } }
          });
        } else {
          return prisma.product.update({
            where: { id: item.product.id },
            data: { warehouseStock: { decrement: item.quantity } }
          });
        }
      })
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
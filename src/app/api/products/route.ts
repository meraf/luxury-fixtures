import { NextResponse } from 'next/server';
import { PrismaClient, Product } from '@prisma/client';

const prisma = new PrismaClient();

// Add this to handle the GET requests that are currently failing
export async function GET() {
  try {
    const products = await prisma.product.findMany();
    // Ensure data is sent as plain numbers to avoid the toFixed() crash
    const sanitizedProducts = products.map(p => ({
      ...p,
      costPrice: Number(p.costPrice),
      sellingPrice: Number(p.sellingPrice)
    }));
    return NextResponse.json(sanitizedProducts);
  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cart = await req.json() as { product: Product, quantity: number, stockSource: 'SHOP' | 'WAREHOUSE' }[];

    await prisma.$transaction(
      cart.map((item) => {
        const productId = Number(item.product.id);
        const quantity = Number(item.quantity);

        if (item.stockSource === 'SHOP') {
          return prisma.product.update({
            where: { id: productId },
            data: { shopStock: { decrement: quantity } }
          });
        } else {
          return prisma.product.update({
            where: { id: productId },
            data: { warehouseStock: { decrement: quantity } }
          });
        }
      })
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Prisma Transaction Error:", error);
    return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Note: In Next.js development, creating a new PrismaClient instance on every reload 
// can exhaust database connections. Consider exporting a single global instance instead.
const prisma = new PrismaClient();

// TypeScript interface for type safety
interface CartItem {
  price: number | string;
  quantity: number | string;
  stockSource: 'SHOP' | 'WAREHOUSE'; // Adjust based on your exact enum/string values
  product: {
    id: number | string;
    costPrice: number | string;
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Extract cashierName instead of cashierId
    const { cart, cashierName } = body;

    // 1. Validation Check: Ensure data exists before processing
    if (!cart || !Array.isArray(cart) || cart.length === 0 || !cashierName) {
      return NextResponse.json(
        { error: 'Bad Request', details: 'Missing or invalid cart or cashierName' },
        { status: 400 }
      );
    }

    // 2. Calculate totals safely
    const totalAmount = cart.reduce((sum: number, item: CartItem) => 
      sum + (Number(item.price) * Number(item.quantity)), 0
    );

    // Calculate profit safely
    const totalProfit = cart.reduce((sum: number, item: CartItem) => 
      sum + ((Number(item.price) - Number(item.product.costPrice)) * Number(item.quantity)), 0
    );

    // 3. Execute database transaction
    const result = await prisma.$transaction(async (tx) => {
      
      // A. Create the Sale and its nested SaleItems
      const sale = await tx.sale.create({
        data: {
          total: totalAmount,
          profit: totalProfit,
          cashierName: String(cashierName), // Save the name as a string
          items: {
            create: cart.map((item: CartItem) => ({
              productId: Number(item.product.id),
              quantity: Number(item.quantity),
              price: Number(item.price),
              stockSource: item.stockSource
            }))
          }
        }
      });

      // B. Update stock levels sequentially to ensure data integrity
      for (const item of cart) {
        const field = item.stockSource === 'SHOP' ? 'shopStock' : 'warehouseStock';
        
        await tx.product.update({
          where: { id: Number(item.product.id) },
          data: { 
            [field]: { 
              decrement: Number(item.quantity) 
            } 
          }
        });
      }

      return sale;
    });

    // 4. Return successful response
    return NextResponse.json({ success: true, saleId: result.id }, { status: 201 });

  } catch (error) {
    console.error("Checkout transaction error:", error);
    return NextResponse.json(
      { error: 'Transaction failed', details: error instanceof Error ? error.message : 'Unknown internal error' }, 
      { status: 500 }
    );
  }
}
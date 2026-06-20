import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Adjust your prisma import

export async function PATCH(req: Request) {
  try {
    const { id, defaultPrice, alertThreshold } = await req.json();

    const updateData: any = {};
    if (defaultPrice !== undefined) updateData.defaultPrice = defaultPrice;
    if (alertThreshold !== undefined) updateData.alertThreshold = alertThreshold;

    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data: updateData,
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

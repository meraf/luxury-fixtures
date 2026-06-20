import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Adjust this path if your prisma client is exported from somewhere else

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        id: 'asc', // Keeps the UI consistent on refresh
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" }, 
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, defaultPrice, alertThreshold } = body;

    // Validate ID
    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" }, 
        { status: 400 }
      );
    }

    // Prepare update payload dynamically based on what was passed
    const updateData: Record<string, any> = {};
    
    if (defaultPrice !== undefined && defaultPrice !== null) {
      updateData.defaultPrice = Number(defaultPrice);
    }
    
    if (alertThreshold !== undefined && alertThreshold !== null) {
      updateData.alertThreshold = Number(alertThreshold);
    }

    // Reject request if no valid fields to update were provided
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields provided to update" }, 
        { status: 400 }
      );
    }

    // Update the record in the database
    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data: updateData,
    });

    return NextResponse.json(updatedProduct);
    
  } catch (error) {
    console.error("PATCH /api/products error:", error);
    return NextResponse.json(
      { error: "Failed to update product settings" }, 
      { status: 500 }
    );
  }
}

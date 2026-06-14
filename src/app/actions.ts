"use server";

import { prisma } from "../lib/prisma";
import { revalidatePath } from "next/cache";

// 1. STOCKING: Add a new product
// Updated to match Product schema fields
export async function addProduct(data: { 
  name: string; 
  sku: string; 
  image: string; 
  costPrice: number; 
  sellingPrice: number; 
  warehouseStock: number; 
  categoryId: number 
}) {
  await prisma.product.create({
    data: {
      name: data.name,
      sku: data.sku,
      image: data.image,
      costPrice: data.costPrice,
      sellingPrice: data.sellingPrice,
      warehouseStock: data.warehouseStock,
      categoryId: data.categoryId,
    },
  });
  revalidatePath("/stocking");
}

// 2. SELLING: Process a transaction
export async function processSale(items: { productId: number; quantity: number; price: number }[]) {
  const totalAmount = items.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);

  return await prisma.$transaction(async (tx) => {
    // Create the order
    const order = await tx.order.create({
      data: {
        totalAmount,
        userId: 1, // Ensure this matches a valid user ID in your database
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            stockSource: "warehouse", // Required field added here
          })),
        },
      },
    });

    // Reduce stock for each item
    for (const item of items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { warehouseStock: { decrement: item.quantity } },
      });
    }

    revalidatePath("/selling");
    revalidatePath("/stocking");
    return order;
  });
}

// 3. ADMIN: Get stats for dashboard
export async function getDashboardStats() {
  const totalRevenue = await prisma.order.aggregate({
    _sum: { totalAmount: true }
  });
  
  const activeOrders = await prisma.order.count();
  const lowStockItems = await prisma.product.count({
    where: { warehouseStock: { lt: 5 } } // Fixed field name
  });

  return {
    revenue: totalRevenue._sum.totalAmount || 0,
    orders: activeOrders,
    lowStock: lowStockItems
  };
}
"use server";

import { prisma } from "../lib/prisma";
import { revalidatePath } from "next/cache";

// 1. STOCKING: Add a new product
export async function addProduct(data: { name: string; price: number; stock: number }) {
  await prisma.product.create({
    data: {
      name: data.name,
      price: data.price,
      stock: data.stock,
    },
  });
  revalidatePath("/stocking");
}

// 2. SELLING: Process a transaction
// This updates stock AND records the order in one transaction
export async function processSale(items: { productId: string; quantity: number; price: number }[]) {
  const totalAmount = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return await prisma.$transaction(async (tx) => {
    // Create the order
    const order = await tx.order.create({
      data: {
        totalAmount,
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    // Reduce stock for each item
    for (const item of items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
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
    where: { stock: { lt: 5 } }
  });

  return {
    revenue: totalRevenue._sum.totalAmount || 0,
    orders: activeOrders,
    lowStock: lowStockItems
  };
}
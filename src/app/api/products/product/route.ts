import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';

const prisma = new PrismaClient();

// Configure Cloudinary from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * 1. POST: Create a brand new product with an image and initial warehouse stock
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      sku, 
      name, 
      description, 
      image, // Expecting base64 string data stream from frontend
      costPrice, 
      sellingPrice, 
      warehouseStock, 
      categoryId 
    } = body;

    // Validate required fields
    if (!sku || !name || !image || !costPrice || !sellingPrice || !categoryId) {
      return NextResponse.json({ error: 'Missing required parameters.' }, { status: 400 });
    }

    // Upload base64 image data string directly to Cloudinary
    let imageUrl = '';
    try {
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: 'luxury_fixtures_inventory',
      });
      imageUrl = uploadResponse.secure_url;
    } catch (uploadError) {
      console.error("Cloudinary upload failure:", uploadError);
      return NextResponse.json({ error: 'Failed to upload product image to cloud storage.' }, { status: 500 });
    }

    // Create item record inside database
    const newProduct = await prisma.product.create({
      data: {
        sku,
        name,
        description,
        image: imageUrl,
        costPrice: Number(costPrice),
        sellingPrice: Number(sellingPrice),
        warehouseStock: Number(warehouseStock) || 0,
        shopStock: 0, // Fresh items default to warehouse first
        categoryId: Number(categoryId),
        status: "ACTIVE"
      },
    });

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (error: any) {
    console.error("Product creation error pipeline:", error);
    // Gracefully catch unique constraint fails on SKUs
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'A product with this unique SKU already exists.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

/**
 * 2. PATCH: Restock an existing product's warehouse inventory level
 */
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { productId, quantityToAdd } = body;

    if (!productId || undefined === quantityToAdd || Number(quantityToAdd) <= 0) {
      return NextResponse.json({ error: 'Valid product ID and positive restock quantity are required.' }, { status: 400 });
    }

    // Safely increment the selected product warehouse record instance counter
    const updatedProduct = await prisma.product.update({
      where: { id: Number(productId) },
      data: {
        warehouseStock: {
          increment: Number(quantityToAdd)
        }
      }
    });

    return NextResponse.json({ success: true, updatedStock: updatedProduct.warehouseStock });
  } catch (error: any) {
    console.error("Warehouse restock adjustment error:", error);
    return NextResponse.json({ error: 'Failed to update warehouse storage allocations.' }, { status: 500 });
  }
}
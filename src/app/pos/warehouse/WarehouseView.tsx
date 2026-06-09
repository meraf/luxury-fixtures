'use client';
import React, { useState, useEffect } from 'react';
import { PackagePlus, RefreshCw, Upload, Sparkles, Layers, Layers3, CheckCircle2, AlertCircle, Loader2, X, Bookmark } from 'lucide-react';

interface Product {
  id: number;
  sku: string;
  name: string;
  warehouseStock: number;
  shopStock: number;
}

interface Category {
  id: number;
  name: string;
}

export default function WarehouseManagement() {
  const [mode, setMode] = useState<'create' | 'restock'>('create');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [labelModalData, setLabelModalData] = useState<{ id: number; name: string; sku: string } | null>(null);

  const [newProduct, setNewProduct] = useState({
    sku: '', name: '', description: '', 
    costPrice: '', sellingPrice: '', warehouseStock: '0', categoryId: ''
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [restock, setRestock] = useState({ productId: '', quantityToAdd: '' });

  const fetchInventoryData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch('/api/product').then(res => res.ok ? res.json() : []),
        fetch('/api/categories').then(res => res.ok ? res.json() : [])
      ]);
      setProducts(Array.isArray(productsRes) ? productsRes : []);
      setCategories(Array.isArray(categoriesRes) ? categoriesRes : []);
    } catch (err) {
      console.error("Data syncing malfunction:", err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const handleImageSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadDirectToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string);

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "Cloudinary upload failed");
    return data.secure_url;
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.sku || !newProduct.name || !imageFile || !newProduct.categoryId) {
      setStatusMsg({ type: 'error', text: 'All starred configuration fields are strictly required.' });
      return;
    }
    setIsSubmitting(true);
    try {
      const cloudinaryUrl = await uploadDirectToCloudinary(imageFile);
      const res = await fetch('/api/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newProduct, image: cloudinaryUrl })
      });
      const data = await res.json();
      if (res.ok && data.product) {
        setLabelModalData({ id: data.product.id, name: data.product.name, sku: data.product.sku });
        setNewProduct({ sku: '', name: '', description: '', costPrice: '', sellingPrice: '', warehouseStock: '0', categoryId: '' });
        setImageFile(null); setImagePreview(null);
        fetchInventoryData();
      }
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRestockWarehouse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restock.productId || !restock.quantityToAdd) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/product', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: Number(restock.productId), quantityToAdd: Number(restock.quantityToAdd) })
      });
      if (res.ok) {
        setRestock({ productId: '', quantityToAdd: '' });
        fetchInventoryData();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-slate-900 font-sans relative">
       {/* ... Your original JSX UI code goes here ... */}
       {/* Ensure all your closing </div> and tags are present */}
    </div>
  );
}
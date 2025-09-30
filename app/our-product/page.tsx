"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/navbar/navbar";
import { getProducts, getCategories, Product } from "@/lib/supabase/products";

// Reusable ProductCard component
const ProductCard: React.FC<Product> = ({ id, name, description, image_url }) => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
    <div className="relative w-full h-64 bg-gray-200">
      <Image 
        src={image_url || '/placeholder.png'} 
        alt={name} 
        fill
        className="object-contain"
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
    </div>
    <div className="p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">{name}</h3>
      <p className="text-gray-600 text-sm mb-4 h-10 overflow-hidden">{description}</p>
      <Link href="/loan-application" className="block w-full">
        <button className="w-full px-4 py-2 font-semibold text-white bg-[#5ca34c] rounded-lg shadow-md hover:bg-[#4a853d] transition-colors">
          Apply Now
        </button>
      </Link>
    </div>
  </div>
);

export default function OurProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts(selectedCategory),
          getCategories(),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory]);

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 text-gray-800 font-sans">
        <div className="container mx-auto px-4 py-8">
          
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900">Our Products</h1>
            <p className="text-lg text-gray-600 mt-2">Explore our curated selection of high-quality products.</p>
          </header>

          <div className="flex justify-center items-center gap-4 mb-12 flex-wrap">
            <button 
              onClick={() => setSelectedCategory(undefined)}
              className={`px-6 py-2 font-semibold rounded-full shadow-md transition-colors ${!selectedCategory ? 'bg-[#5ca34c] text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>
              All Products
            </button>
            {categories.map((category) => (
              <button 
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 font-semibold rounded-full shadow-md transition-colors ${selectedCategory === category.id ? 'bg-[#5ca34c] text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>
                {category.name}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center text-gray-500">Loading products...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {products.length > 0 ? (
                products.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500">No products found in this category.</p>
              )}
            </div>
          )}

        </div>
      </div>
    </>
  );
}

// lib/supabase/products.ts
import { createClient } from './client';

const supabase = createClient();


export type Product = {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  category_id: string | null;
  category_name?: string;
};

export async function getProducts(categoryId?: string) {
  try {
    console.log('Fetching products...');
    
    // First, get the category name if categoryId is provided
    let categoryName = undefined;
    if (categoryId) {
      console.log('Getting category name for ID:', categoryId);
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('name')
        .eq('id', categoryId)
        .single();
      
      if (!categoryError && categoryData) {
        categoryName = categoryData.name;
      }
    }

    // Build the base query
    let query = supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    // Add category filter if categoryId is provided
    if (categoryId) {
      console.log('Filtering products by category ID:', categoryId);
      query = query.eq('category_id', categoryId);
    }

    console.log('Executing products query...');
    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Failed to fetch products: ${error.message}`);
    }

    console.log(`Found ${data?.length || 0} products`);

    if (!data || data.length === 0) {
      console.warn('No products found' + (categoryId ? ` for category ${categoryId}` : ''));
      return [];
    }

    // Transform the data to include category_name
    return data.map((product) => ({
      ...product,
      category_name: categoryName || product.categories?.name || 'Uncategorized'
    })) as Product[];
  } catch (error) {
    console.error('Error in getProducts:', error);
    throw error;
  }
}

export async function getCategories() {
  try {
    console.log('Fetching categories...');
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }

    console.log('Categories:', data);
    return data;
  } catch (error) {
    console.error('Error in getCategories:', error);
    throw error;
  }
}
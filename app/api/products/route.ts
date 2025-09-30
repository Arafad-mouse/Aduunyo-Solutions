import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getProducts } from '@/lib/supabase/products';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    
    // Check if user is authenticated
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      console.error('Authentication error:', sessionError?.message || 'No active session');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category') || undefined;
    
    console.log('API Request - Category ID:', categoryId, 'for user:', session.user?.email);
    
    // Get products with the user's session
    const products = await getProducts(categoryId);
    
    return NextResponse.json(products);
    
  } catch (error) {
    console.error('Error in /api/products:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch products', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

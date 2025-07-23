import { supabase, Product, User, Review, Sale, CartItem, Favorite, ApiResponse, PaginatedResponse } from './supabase'

// Products API
export const getProducts = async (params?: {
  page?: number
  per_page?: number
  category?: string
  subject?: string
  search?: string
  min_price?: number
  max_price?: number
  grade_levels?: string[]
}): Promise<PaginatedResponse<Product>> => {
  try {
    let query = supabase
      .from('products')
      .select(`
        *,
        author:users(id, name, email, average_rating, is_verified)
      `)
      .eq('status', 'active')

    // Apply filters
    if (params?.search) {
      query = query.or(`title.ilike.%${params.search}%,description.ilike.%${params.search}%`)
    }

    if (params?.category && params.category !== 'all') {
      query = query.eq('category', params.category)
    }

    if (params?.subject && params.subject !== 'all') {
      query = query.eq('subject', params.subject)
    }

    if (params?.min_price !== undefined) {
      query = query.gte('price', params.min_price)
    }

    if (params?.max_price !== undefined) {
      query = query.lte('price', params.max_price)
    }

    if (params?.grade_levels && params.grade_levels.length > 0) {
      query = query.overlaps('grade_level', params.grade_levels)
    }

    // Pagination
    const page = params?.page || 1
    const per_page = params?.per_page || 12
    const from = (page - 1) * per_page
    const to = from + per_page - 1

    // Get total count
    const { count } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')

    // Get paginated results
    const { data, error } = await query
      .range(from, to)
      .order('created_at', { ascending: false })

    if (error) throw error

    return {
      success: true,
      data: {
        items: data || [],
        pagination: {
          total: count || 0,
          page,
          per_page,
          total_pages: Math.ceil((count || 0) / per_page)
        }
      }
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    }
  }
}

export const getProduct = async (id: string): Promise<ApiResponse<Product>> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        author:users(id, name, email, average_rating, is_verified, bio, specialties),
        reviews(
          id,
          rating,
          comment,
          created_at,
          user:users(id, name)
        )
      `)
      .eq('id', id)
      .eq('status', 'active')
      .single()

    if (error) throw error

    return {
      success: true,
      data
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    }
  }
}

export const getCategories = async (): Promise<ApiResponse<string[]>> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('category')
      .eq('status', 'active')

    if (error) throw error

    const categories = [...new Set(data?.map(item => item.category) || [])]
    
    return {
      success: true,
      data: categories
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    }
  }
}

export const getSubjects = async (): Promise<ApiResponse<string[]>> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('subject')
      .eq('status', 'active')

    if (error) throw error

    const subjects = [...new Set(data?.map(item => item.subject) || [])]
    
    return {
      success: true,
      data: subjects
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    }
  }
}

// Cart API
export const getCartItems = async (userId: string): Promise<ApiResponse<CartItem[]>> => {
  try {
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        product:products(
          id,
          title,
          price,
          thumbnail_url,
          author:users(name)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return {
      success: true,
      data: data || []
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    }
  }
}

export const addToCart = async (userId: string, productId: string): Promise<ApiResponse<CartItem>> => {
  try {
    // Check if item already exists
    const { data: existing } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single()

    if (existing) {
      return {
        success: false,
        error: 'Item já está no carrinho'
      }
    }

    const { data, error } = await supabase
      .from('cart_items')
      .insert({
        user_id: userId,
        product_id: productId,
        quantity: 1
      })
      .select()
      .single()

    if (error) throw error

    return {
      success: true,
      data
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    }
  }
}

export const removeFromCart = async (userId: string, productId: string): Promise<ApiResponse<void>> => {
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId)

    if (error) throw error

    return {
      success: true
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    }
  }
}

export const clearCart = async (userId: string): Promise<ApiResponse<void>> => {
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId)

    if (error) throw error

    return {
      success: true
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    }
  }
}

// Sales API
export const createSale = async (saleData: {
  product_id: string
  buyer_id: string
  seller_id: string
  amount: number
  payment_method: string
  payment_id?: string
}): Promise<ApiResponse<Sale>> => {
  try {
    const { data, error } = await supabase
      .from('sales')
      .insert({
        ...saleData,
        status: 'completed', // For demo purposes, mark as completed immediately
        transaction_id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      })
      .select(`
        *,
        product:products(id, title, price),
        buyer:users(id, name, email),
        seller:users(id, name, email)
      `)
      .single()

    if (error) throw error

    // Update product download count
    await supabase.rpc('increment_download_count', { product_id: saleData.product_id })

    return {
      success: true,
      data
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    }
  }
}

export const getUserSales = async (userId: string, type: 'purchases' | 'sales'): Promise<ApiResponse<Sale[]>> => {
  try {
    const column = type === 'purchases' ? 'buyer_id' : 'seller_id'
    
    const { data, error } = await supabase
      .from('sales')
      .select(`
        *,
        product:products(id, title, price, thumbnail_url),
        buyer:users(id, name, email),
        seller:users(id, name, email)
      `)
      .eq(column, userId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return {
      success: true,
      data: data || []
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    }
  }
}

// Reviews API
export const createReview = async (reviewData: {
  product_id: string
  user_id: string
  rating: number
  comment?: string
}): Promise<ApiResponse<Review>> => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .insert(reviewData)
      .select(`
        *,
        user:users(id, name),
        product:products(id, title)
      `)
      .single()

    if (error) throw error

    // Update product rating
    await supabase.rpc('update_product_rating', { product_id: reviewData.product_id })

    return {
      success: true,
      data
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    }
  }
}

// Favorites API
export const getFavorites = async (userId: string): Promise<ApiResponse<Favorite[]>> => {
  try {
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        *,
        product:products(
          id,
          title,
          price,
          rating,
          thumbnail_url,
          author:users(name)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return {
      success: true,
      data: data || []
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    }
  }
}

export const addToFavorites = async (userId: string, productId: string): Promise<ApiResponse<Favorite>> => {
  try {
    const { data, error } = await supabase
      .from('favorites')
      .insert({
        user_id: userId,
        product_id: productId
      })
      .select()
      .single()

    if (error) throw error

    return {
      success: true,
      data
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    }
  }
}

export const removeFromFavorites = async (userId: string, productId: string): Promise<ApiResponse<void>> => {
  try {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId)

    if (error) throw error

    return {
      success: true
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    }
  }
}

// Utility functions for database
export const createDatabaseFunctions = async () => {
  // Function to increment download count
  await supabase.rpc('create_function', {
    sql: `
      CREATE OR REPLACE FUNCTION increment_download_count(product_id UUID)
      RETURNS void AS $$
      BEGIN
        UPDATE products 
        SET download_count = download_count + 1 
        WHERE id = product_id;
      END;
      $$ LANGUAGE plpgsql;
    `
  })

  // Function to update product rating
  await supabase.rpc('create_function', {
    sql: `
      CREATE OR REPLACE FUNCTION update_product_rating(product_id UUID)
      RETURNS void AS $$
      DECLARE
        avg_rating DECIMAL(3,2);
        review_count INTEGER;
      BEGIN
        SELECT AVG(rating), COUNT(*) 
        INTO avg_rating, review_count
        FROM reviews 
        WHERE product_id = product_id;
        
        UPDATE products 
        SET rating = COALESCE(avg_rating, 0),
            review_count = review_count
        WHERE id = product_id;
      END;
      $$ LANGUAGE plpgsql;
    `
  })
}


// Update cart item quantity
export const updateCartItemQuantity = async (userId: string, productId: string, quantity: number): Promise<ApiResponse<CartItem>> => {
  try {
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('user_id', userId)
      .eq('product_id', productId)
      .select(`
        *,
        product:products(*)
      `)
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error updating cart item quantity:', error)
    return { success: false, error: 'Erro interno do servidor' }
  }
}


// Create new product
export const createProduct = async (productData: {
  title: string
  description: string
  category: string
  subject: string
  grade_level: string[]
  price: number
  tags: string[]
  file_url: string
  preview_images: string[]
  author_id: string
  status: string
}): Promise<ApiResponse<Product>> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([{
        ...productData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select(`
        *,
        author:users(id, name, email, average_rating, is_verified)
      `)
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error creating product:', error)
    return { success: false, error: 'Erro interno do servidor' }
  }
}

// Update product
export const updateProduct = async (productId: string, productData: Partial<Product>): Promise<ApiResponse<Product>> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update({
        ...productData,
        updated_at: new Date().toISOString()
      })
      .eq('id', productId)
      .select(`
        *,
        author:users(id, name, email, average_rating, is_verified)
      `)
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error updating product:', error)
    return { success: false, error: 'Erro interno do servidor' }
  }
}

// Delete product
export const deleteProduct = async (productId: string): Promise<ApiResponse<boolean>> => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data: true }
  } catch (error) {
    console.error('Error deleting product:', error)
    return { success: false, error: 'Erro interno do servidor' }
  }
}


import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface User {
  id: string
  email: string
  name: string
  user_type: 'buyer' | 'seller' | 'admin'
  bio?: string
  avatar_url?: string
  is_verified: boolean
  is_active: boolean
  specialties?: string
  experience_years?: number
  education?: string
  average_rating: number
  rating_count: number
  total_sales: number
  total_revenue: number
  total_products: number
  created_at: string
  updated_at: string
  last_login?: string
}

export interface Product {
  id: string
  title: string
  description?: string
  price: number
  category: string
  subject: string
  grade_level: string[]
  tags?: string[]
  file_url?: string
  thumbnail_url?: string
  status: 'active' | 'draft' | 'inactive'
  download_count: number
  rating: number
  review_count: number
  total_revenue: number
  author_id: string
  created_at: string
  updated_at: string
  // Joined data
  author?: User
  reviews?: Review[]
}

export interface Review {
  id: string
  product_id: string
  user_id: string
  rating: number
  comment?: string
  created_at: string
  updated_at: string
  // Joined data
  user?: User
  product?: Product
}

export interface Sale {
  id: string
  product_id: string
  buyer_id: string
  seller_id: string
  amount: number
  status: 'pending' | 'completed' | 'cancelled' | 'refunded'
  payment_method?: string
  payment_id?: string
  transaction_id?: string
  notes?: string
  created_at: string
  updated_at: string
  // Joined data
  product?: Product
  buyer?: User
  seller?: User
}

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  quantity: number
  created_at: string
  // Joined data
  product?: Product
}

export interface Favorite {
  id: string
  user_id: string
  product_id: string
  created_at: string
  // Joined data
  product?: Product
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data?: {
    items: T[]
    pagination: {
      total: number
      page: number
      per_page: number
      total_pages: number
    }
  }
  error?: string
}


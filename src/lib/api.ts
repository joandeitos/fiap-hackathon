// Re-export Supabase API functions
export * from './supabase-api'
export * from './supabase'

// Keep the old interface for backward compatibility
import { 
  getProducts as supabaseGetProducts,
  getProduct as supabaseGetProduct,
  getCategories as supabaseGetCategories,
  getSubjects as supabaseGetSubjects,
  createSale as supabaseCreateSale,
  createReview as supabaseCreateReview,
  getUserSales as supabaseGetUserSales
} from './supabase-api'

// Legacy API functions that now use Supabase
export const getProducts = supabaseGetProducts
export const getProduct = supabaseGetProduct
export const getCategories = supabaseGetCategories
export const getSubjects = supabaseGetSubjects
export const createSale = supabaseCreateSale
export const createReview = supabaseCreateReview

// Additional functions for backward compatibility
export const getSales = supabaseGetUserSales
export const getUserSales = supabaseGetUserSales

// Mock function for sales stats (to be implemented later)
export const getSalesStats = async (userId: string) => {
  return {
    success: true,
    data: {
      totalSales: 0,
      totalRevenue: 0,
      thisMonth: 0,
      lastMonth: 0
    }
  }
}

// Health check function
export const healthCheck = async () => {
  return {
    success: true,
    data: {
      status: 'ok',
      message: 'EduMarketplace API is running with Supabase',
      version: '2.0.0'
    }
  }
}


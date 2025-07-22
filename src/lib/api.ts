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
  createReview as supabaseCreateReview
} from './supabase-api'

// Legacy API functions that now use Supabase
export const getProducts = supabaseGetProducts
export const getProduct = supabaseGetProduct
export const getCategories = supabaseGetCategories
export const getSubjects = supabaseGetSubjects
export const createSale = supabaseCreateSale
export const createReview = supabaseCreateReview

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


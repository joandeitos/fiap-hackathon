import axios from 'axios'

// API base URL - use environment variable or default to localhost
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API Types
export interface User {
  id: number
  name: string
  email: string
  userType: 'buyer' | 'seller' | 'admin'
  bio?: string
  avatarUrl?: string
  isVerified: boolean
  isActive: boolean
  specialties?: string
  experienceYears?: number
  education?: string
  averageRating: number
  ratingCount: number
  totalSales: number
  totalRevenue: number
  totalProducts: number
  createdAt: string
  updatedAt: string
  lastLogin?: string
}

export interface Product {
  id: number
  title: string
  description: string
  price: number
  category: string
  subject: string
  gradeLevel: string[]
  tags: string[]
  fileUrl?: string
  thumbnailUrl?: string
  status: 'active' | 'draft' | 'inactive'
  downloadCount: number
  rating: number
  reviewCount: number
  totalRevenue: number
  author: {
    id: number
    name: string
    email: string
    rating: number
  }
  createdAt: string
  updatedAt: string
  reviews?: Review[]
}

export interface Review {
  id: number
  rating: number
  comment?: string
  user: {
    id: number
    name: string
  }
  createdAt: string
  updatedAt: string
}

export interface Sale {
  id: number
  amount: number
  status: 'pending' | 'completed' | 'cancelled'
  paymentMethod?: string
  transactionId?: string
  product: {
    id: number
    title: string
  }
  buyer: {
    id: number
    name: string
  }
  seller: {
    id: number
    name: string
  }
  createdAt: string
  updatedAt: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: {
    [key: string]: T[]
    pagination: {
      page: number
      pages: number
      per_page: number
      total: number
      has_next: boolean
      has_prev: boolean
    }
  }
}

// API Functions

// Health Check
export const healthCheck = async (): Promise<ApiResponse<{ status: string; message: string; version: string }>> => {
  const response = await api.get('/health')
  return response.data
}

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
  const response = await api.get('/products', { params })
  return response.data
}

export const getProduct = async (id: number): Promise<ApiResponse<Product>> => {
  const response = await api.get(`/products/${id}`)
  return response.data
}

export const createProduct = async (productData: Partial<Product>): Promise<ApiResponse<Product>> => {
  const response = await api.post('/products', productData)
  return response.data
}

export const updateProduct = async (id: number, productData: Partial<Product>): Promise<ApiResponse<Product>> => {
  const response = await api.put(`/products/${id}`, productData)
  return response.data
}

export const deleteProduct = async (id: number): Promise<ApiResponse<{ message: string }>> => {
  const response = await api.delete(`/products/${id}`)
  return response.data
}

export const createReview = async (productId: number, reviewData: {
  rating: number
  comment?: string
  userId: number
}): Promise<ApiResponse<Review>> => {
  const response = await api.post(`/products/${productId}/reviews`, reviewData)
  return response.data
}

// Categories and Subjects
export const getCategories = async (): Promise<ApiResponse<string[]>> => {
  const response = await api.get('/categories')
  return response.data
}

export const getSubjects = async (): Promise<ApiResponse<string[]>> => {
  const response = await api.get('/subjects')
  return response.data
}

// Sales API
export const getSales = async (params?: {
  page?: number
  per_page?: number
  seller_id?: number
  buyer_id?: number
  status?: string
  start_date?: string
  end_date?: string
}): Promise<PaginatedResponse<Sale>> => {
  const response = await api.get('/sales', { params })
  return response.data
}

export const getSale = async (id: number): Promise<ApiResponse<Sale>> => {
  const response = await api.get(`/sales/${id}`)
  return response.data
}

export const createSale = async (saleData: {
  productId: number
  buyerId: number
  paymentMethod: string
}): Promise<ApiResponse<Sale>> => {
  const response = await api.post('/sales', saleData)
  return response.data
}

export const completeSale = async (id: number): Promise<ApiResponse<Sale>> => {
  const response = await api.post(`/sales/${id}/complete`)
  return response.data
}

export const cancelSale = async (id: number): Promise<ApiResponse<Sale>> => {
  const response = await api.post(`/sales/${id}/cancel`)
  return response.data
}

export const getSalesStats = async (params?: {
  seller_id?: number
  buyer_id?: number
  days?: number
}): Promise<ApiResponse<{
  period: { start_date: string; end_date: string; days: number }
  totals: { total_sales: number; completed_sales: number; pending_sales: number; cancelled_sales: number; total_revenue: number; average_sale_value: number }
  daily_breakdown: Array<{ date: string; sales: number; revenue: number }>
}>> => {
  const response = await api.get('/sales/stats', { params })
  return response.data
}

// Users API (placeholder - implement when user routes are ready)
export const getUsers = async (): Promise<ApiResponse<User[]>> => {
  const response = await api.get('/users')
  return response.data
}

export const getUser = async (id: number): Promise<ApiResponse<User>> => {
  const response = await api.get(`/users/${id}`)
  return response.data
}

export const createUser = async (userData: Partial<User>): Promise<ApiResponse<User>> => {
  const response = await api.post('/users', userData)
  return response.data
}

export const updateUser = async (id: number, userData: Partial<User>): Promise<ApiResponse<User>> => {
  const response = await api.put(`/users/${id}`, userData)
  return response.data
}

// Auth functions (placeholder)
export const login = async (email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> => {
  const response = await api.post('/auth/login', { email, password })
  if (response.data.success && response.data.data?.token) {
    localStorage.setItem('auth_token', response.data.data.token)
  }
  return response.data
}

export const register = async (userData: {
  name: string
  email: string
  password: string
  userType: string
}): Promise<ApiResponse<{ user: User; token: string }>> => {
  const response = await api.post('/auth/register', userData)
  if (response.data.success && response.data.data?.token) {
    localStorage.setItem('auth_token', response.data.data.token)
  }
  return response.data
}

export const logout = async (): Promise<void> => {
  localStorage.removeItem('auth_token')
}

export default api


import { api } from './api'

export interface User {
  _id: string
  username: string
  email?: string
  fullName?: string
  role: 'student' | 'teacher' | 'admin'
  enrolledCourses?: string[]
  currentMembership?: string
  hasActiveMembership: boolean
  createdAt: string
}

export interface Membership {
  _id: string
  user: User | string
  type: 'weekly' | 'monthly' | 'quarterly' | 'semiannual' | 'annual'
  status: 'active' | 'expired' | 'cancelled' | 'pending'
  startDate: string
  endDate: string
  price: number
  currency: string
  paymentId?: string
  autoRenew: boolean
}

export interface Payment {
  _id: string
  user: User | string
  membership: Membership | string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  paymentMethod: string
  transactionId?: string
  paymentDate?: string
}

export interface DashboardStats {
  stats: {
    totalUsers: number
    totalStudents: number
    activeMemberships: number
    totalPayments: number
    revenue: number
  }
  membershipsByType: Array<{ _id: string; count: number }>
  recentPayments: Payment[]
}

export interface AIUsageStats {
  period: number
  summary: {
    totalContentGenerated: number
    totalRecommendations: number
    totalTokens: number
    totalCacheHits: number
    estimatedCostUSD: number
    cacheHitRate: string
  }
  realTimeStats: {
    cacheHits: number
    apiCalls: number
    cacheHitRate: string
    lastReset: string
  }
  byContentType: Array<{
    _id: string
    count: number
    totalTokens: number
    totalUsage: number
    avgTokens: number
  }>
  byModel: Array<{
    _id: string
    count: number
    totalTokens: number
  }>
  dailyStats: Array<{
    _id: string
    count: number
    tokens: number
  }>
  cacheStats: {
    totalGenerated: number
    totalCacheHits: number
    avgUsagePerItem: number
  }
}

export interface UsersResponse {
  users: User[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface MembershipsResponse {
  memberships: Membership[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export const adminService = {
  async getDashboardStats(): Promise<DashboardStats> {
    return api.get<DashboardStats>('/admin/dashboard')
  },

  async getUsers(params?: {
    page?: number
    limit?: number
    search?: string
    role?: string
  }): Promise<UsersResponse> {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.search) queryParams.append('search', params.search)
    if (params?.role) queryParams.append('role', params.role)

    const query = queryParams.toString()
    return api.get<UsersResponse>(`/admin/users${query ? `?${query}` : ''}`)
  },

  async getUserById(id: string) {
    return api.get<{ user: User; memberships: Membership[] }>(`/admin/users/${id}`)
  },

  async createUser(data: {
    username: string
    password: string
    email?: string
    fullName?: string
    role?: 'student' | 'teacher' | 'admin'
  }) {
    return api.post('/admin/users', data)
  },

  async updateUser(id: string, data: {
    email?: string
    fullName?: string
    role?: string
    password?: string
  }) {
    return api.put(`/admin/users/${id}`, data)
  },

  async deleteUser(id: string) {
    return api.delete(`/admin/users/${id}`)
  },

  async getMemberships(params?: {
    page?: number
    limit?: number
    status?: string
    userId?: string
  }): Promise<MembershipsResponse> {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.status) queryParams.append('status', params.status)
    if (params?.userId) queryParams.append('userId', params.userId)

    const query = queryParams.toString()
    return api.get<MembershipsResponse>(`/admin/memberships${query ? `?${query}` : ''}`)
  },

  async updateMembership(id: string, data: {
    status?: string
    endDate?: string
    autoRenew?: boolean
  }) {
    return api.put(`/admin/memberships/${id}`, data)
  },

  async getAIUsageStats(period?: number): Promise<AIUsageStats> {
    const query = period ? `?period=${period}` : ''
    return api.get<AIUsageStats>(`/admin/ai-usage${query}`)
  },
}


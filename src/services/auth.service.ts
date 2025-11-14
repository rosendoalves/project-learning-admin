import { api } from './api'

export interface LoginResponse {
  message: string
  token: string
  user: {
    id: string
    username: string
    email?: string
    fullName?: string
    role: string
  }
}

export interface LoginData {
  username: string
  password: string
}

export const authService = {
  async login(data: LoginData): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', data)
    if (response.token) {
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
    }
    return response
  },

  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token')
  },

  isAdmin(): boolean {
    const userStr = localStorage.getItem('user')
    if (!userStr) return false
    const user = JSON.parse(userStr)
    return user.role === 'admin'
  },

  getToken(): string | null {
    return localStorage.getItem('token')
  },

  getUser() {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },
}


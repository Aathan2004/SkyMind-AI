import { AxiosError } from 'axios'
import api from './api'

export interface AuthUser {
  id: number
  name: string
  email: string
  role: string
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
  token_type: 'bearer'
  expires_in: number
  user: AuthUser
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
}

function storage(remember: boolean) {
  return remember ? localStorage : sessionStorage
}

function saveSession(response: AuthResponse, remember: boolean) {
  logout()
  const target = storage(remember)
  target.setItem('access_token', response.access_token)
  target.setItem('refresh_token', response.refresh_token)
  target.setItem('user', JSON.stringify(response.user))
}

export async function login(email: string, password: string, remember = true) {
  const form = new URLSearchParams()
  form.append('username', email)
  form.append('password', password)
  const res = await api.post<AuthResponse>('/api/auth/login', form, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
  saveSession(res.data, remember)
  return res.data
}

export async function register(payload: RegisterPayload) {
  const res = await api.post<AuthUser>('/api/auth/register', payload)
  return res.data
}

export async function refreshSession() {
  const refreshToken = localStorage.getItem('refresh_token') || sessionStorage.getItem('refresh_token')
  if (!refreshToken) return null
  try {
    const res = await api.post<AuthResponse>('/api/auth/refresh', { refresh_token: refreshToken })
    saveSession(res.data, Boolean(localStorage.getItem('refresh_token')))
    return res.data
  } catch {
    logout()
    return null
  }
}

export function logout() {
  for (const target of [localStorage, sessionStorage]) {
    target.removeItem('access_token')
    target.removeItem('refresh_token')
    target.removeItem('user')
  }
}

export function getToken() {
  return localStorage.getItem('access_token') || sessionStorage.getItem('access_token')
}

export function getStoredUser(): AuthUser | null {
  const rawUser = localStorage.getItem('user') || sessionStorage.getItem('user')
  try {
    return rawUser ? JSON.parse(rawUser) as AuthUser : null
  } catch {
    logout()
    return null
  }
}

export function getErrorMessage(error: unknown): string {
  const response = error as AxiosError<{ detail?: string }>
  const detail = response.response?.data?.detail
  if (typeof detail === 'string') return detail
  if (response.code === 'ERR_NETWORK') return 'Unable to connect to SkyMind AI. Check that the backend is running.'
  return 'Something went wrong. Please try again.'
}

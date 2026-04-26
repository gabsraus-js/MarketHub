import type { Marketplace, User, Product, ProductPayload } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
export const BACKEND_URL = API_URL.replace(/\/api$/, '')

async function fetcher<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export const api = {
  marketplaces: {
    list: (params?: { search?: string; category?: string }) => {
      const query = new URLSearchParams(
        Object.fromEntries(Object.entries(params ?? {}).filter(([, v]) => v !== undefined)) as Record<string, string>
      ).toString()
      return fetcher<Marketplace[]>(`/marketplaces${query ? `?${query}` : ''}`)
    },
    get: (id: string) => fetcher<Marketplace>(`/marketplaces/${id}`),
    join: (id: string, userId: string) =>
      fetcher(`/marketplaces/${id}/join`, { method: 'POST', body: JSON.stringify({ userId }) }),
    leave: (id: string, userId: string) =>
      fetcher(`/marketplaces/${id}/leave`, { method: 'DELETE', body: JSON.stringify({ userId }) }),
  },
  users: {
    get: (id: string) => fetcher<User>(`/users/${id}`),
    update: (id: string, data: Partial<User>) =>
      fetcher<User>(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    marketplaces: (id: string) => fetcher<Marketplace[]>(`/users/${id}/marketplaces`),
  },
  products: {
    list: (userId: string) => fetcher<Product[]>(`/products?userId=${userId}`),
    create: (data: { userId: string } & ProductPayload) =>
      fetcher<Product>('/products', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: ProductPayload) =>
      fetcher<Product>(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => fetcher<void>(`/products/${id}`, { method: 'DELETE' }),
  },
  upload: async (file: File): Promise<{ url: string }> => {
    const body = new FormData()
    body.append('file', file)
    const res = await fetch(`${API_URL}/upload`, { method: 'POST', body })
    if (!res.ok) throw new Error('Upload failed')
    return res.json()
  },
}

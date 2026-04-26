export interface User {
  id: string
  email: string
  name: string
  bio: string | null
  avatar: string | null
  createdAt: string
  updatedAt: string
  _count?: {
    memberships: number
  }
}

export interface Marketplace {
  id: string
  name: string
  description: string
  category: string
  logo: string | null
  website: string | null
  memberCount: number
  createdAt: string
  updatedAt: string
  joinedAt?: string
}

export interface ProductImage {
  id: string
  productId: string
  url: string
  order: number
  createdAt: string
}

export interface ProductListing {
  id: string
  productId: string
  marketplaceId: string
  price: number
  currency: string
  marketplace: Marketplace
}

export interface Product {
  id: string
  userId: string
  name: string
  description: string | null
  createdAt: string
  updatedAt: string
  listings: ProductListing[]
  images: ProductImage[]
}

export interface ProductListingPayload {
  marketplaceId: string
  price: number
}

export interface ProductPayload {
  name: string
  description: string
  listings: ProductListingPayload[]
  imageUrls: string[]
}

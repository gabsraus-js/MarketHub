'use client'

import { useState } from 'react'
import { Input } from '@/components/atoms/Input'

interface SearchBarProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  className?: string
}

const SearchIcon = (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)

export function SearchBar({ placeholder = 'Search marketplaces...', value, onChange, className = '' }: SearchBarProps) {
  const [internal, setInternal] = useState('')
  const current = value !== undefined ? value : internal

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternal(e.target.value)
    onChange?.(e.target.value)
  }

  return (
    <Input
      value={current}
      onChange={handleChange}
      placeholder={placeholder}
      icon={SearchIcon}
      className={className}
    />
  )
}

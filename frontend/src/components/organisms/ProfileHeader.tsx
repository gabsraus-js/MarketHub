'use client'

import { useState } from 'react'
import { Avatar } from '@/components/atoms/Avatar'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import type { User } from '@/types'

interface Props {
  user: User
  onUpdate?: (data: Partial<User>) => Promise<void>
}

export function ProfileHeader({ user, onUpdate }: Props) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(user.name)
  const [bio, setBio] = useState(user.bio ?? '')
  const [loading, setLoading] = useState(false)

  const save = async () => {
    setLoading(true)
    try {
      await onUpdate?.({ name, bio: bio || null })
      setEditing(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-6 sm:p-8">
      <div className="flex items-start gap-5">
        <Avatar src={user.avatar} alt={user.name} size="xl" />
        <div className="flex-1 min-w-0">
          {editing ? (
            <div className="space-y-3 max-w-sm">
              <Input
                label="Name"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
              />
              <Input
                label="Bio"
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder="Brief bio..."
              />
              <div className="flex gap-2 pt-1">
                <Button size="sm" loading={loading} onClick={save}>
                  Save changes
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
                  <p className="text-sm text-slate-400 mt-0.5">{user.email}</p>
                </div>
                <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>
                  Edit Profile
                </Button>
              </div>
              {user.bio && (
                <p className="text-sm text-slate-600 mt-3 leading-relaxed max-w-lg">{user.bio}</p>
              )}
              <div className="mt-4 flex items-center gap-6">
                <div>
                  <span className="text-xl font-bold text-slate-900">{user._count?.memberships ?? 0}</span>
                  <span className="text-sm text-slate-400 ml-1.5">Marketplaces joined</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

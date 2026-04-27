'use client'

import { useState } from 'react'
import { Avatar } from '@/components/atoms/Avatar'
import { Button } from '@/components/atoms/Button'
import { Card } from '@/components/atoms/Card'
import { Input } from '@/components/atoms/Input'
import type { User } from '@/types'

interface Props {
  user: User
  onUpdate?: (data: Partial<User>) => Promise<void>
  level?: number
  levelName?: string
}

export function ProfileHeader({ user, onUpdate, level, levelName }: Props) {
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
    <Card variant="glass" padding="none" className="p-6 sm:p-8">
      <div className="flex items-start gap-5">
        <div className="relative shrink-0">
          <Avatar src={user.avatar} alt={user.name} size="xl" />
          {level && (
            <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center text-white text-[10px] font-bold ring-2 ring-card shadow-soft">
              {level}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          {editing ? (
            <div className="space-y-3 max-w-sm">
              <Input label="Name" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
              <Input label="Bio" value={bio} onChange={e => setBio(e.target.value)} placeholder="Brief bio..." />
              <div className="flex gap-2 pt-1">
                <Button size="sm" loading={loading} onClick={save}>Save changes</Button>
                <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl font-bold text-fg">{user.name}</h2>
                    {level && levelName && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-subtle text-primary text-xs font-semibold">
                        Lv.{level} · {levelName}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-fg-subtle mt-0.5">{user.email}</p>
                </div>
                <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>
                  Edit Profile
                </Button>
              </div>
              {user.bio && (
                <p className="text-sm text-fg-muted mt-3 leading-relaxed max-w-lg">{user.bio}</p>
              )}
            </>
          )}
        </div>
      </div>
    </Card>
  )
}

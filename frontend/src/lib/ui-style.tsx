'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export type UIStyle = 'liquidglass' | 'neumorphism'

interface Ctx {
  style: UIStyle
  setStyle: (s: UIStyle) => void
}

const UIStyleContext = createContext<Ctx>({ style: 'liquidglass', setStyle: () => {} })

function applyStyle(s: UIStyle) {
  document.documentElement.setAttribute('data-ui-style', s)
  localStorage.setItem('ui-style', s)
}

export function UIStyleProvider({ children }: { children: React.ReactNode }) {
  const [style, setStyleState] = useState<UIStyle>('liquidglass')

  useEffect(() => {
    const saved = localStorage.getItem('ui-style') as UIStyle | null
    const resolved: UIStyle = saved === 'neumorphism' ? 'neumorphism' : 'liquidglass'
    applyStyle(resolved)
    setStyleState(resolved)
  }, [])

  const setStyle = (s: UIStyle) => {
    applyStyle(s)
    setStyleState(s)
  }

  return (
    <UIStyleContext.Provider value={{ style, setStyle }}>
      {children}
    </UIStyleContext.Provider>
  )
}

export const useUIStyle = () => useContext(UIStyleContext)

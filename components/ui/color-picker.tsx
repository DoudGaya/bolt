'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'

interface ColorPickerProps {
  value: string
  onChange: (value: string) => void
  className?: string
  disabled?: boolean
}

export function ColorPicker({ value, onChange, className, disabled }: ColorPickerProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent hydration mismatch by not rendering the color input on server
  if (!mounted) {
    return (
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 p-1 border-2 rounded-md bg-muted" />
        <Input
          placeholder="#000000"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <Input
        type="color"
        className={`w-12 h-12 p-1 border-2 ${className || ''}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
      <Input
        placeholder="#000000"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
    </div>
  )
}

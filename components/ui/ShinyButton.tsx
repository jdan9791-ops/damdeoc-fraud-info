"use client"

import type React from "react"
import { useState, useRef } from "react"
import "./shiny-button.css"

interface ShinyButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  variant?: "primary" | "light" | "secondary"
  disabled?: boolean
  as?: "button" | "a"
  href?: string
}

export function ShinyButton({
  children,
  onClick,
  className = "",
  variant = "primary",
  disabled = false,
  as: Tag = "button",
  href,
}: ShinyButtonProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const ref = useRef<HTMLButtonElement & HTMLAnchorElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect()
      setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    }
  }

  const props = {
    ref,
    className: `shiny-cta ${variant} ${className}`,
    onMouseMove: handleMouseMove,
    style: { "--mouse-x": `${mousePosition.x}px`, "--mouse-y": `${mousePosition.y}px` } as React.CSSProperties,
    ...(Tag === "button" ? { onClick, disabled } : { href }),
  }

  return (
    <Tag {...(props as any)}>
      <span>{children}</span>
    </Tag>
  )
}

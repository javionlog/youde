import { CSSProperties } from 'react'

declare global {
  interface StyledProps {
    className?: string
    style?: CSSProperties
  }
}

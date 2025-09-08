interface GridContextProps {
  column: number
  gap: number | number[]
  collapsed: boolean
  maxRows: number
}

export const GridContext = createContext<GridContextProps>({
  column: 0,
  gap: 0,
  collapsed: false,
  maxRows: 0
})

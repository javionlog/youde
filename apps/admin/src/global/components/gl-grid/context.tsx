interface GridContextProps {
  column: number
  gap: number | number[]
}

export const GridContext = createContext<GridContextProps>({
  column: 0,
  gap: 0
})

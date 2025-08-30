import { AppRouter } from './global/components'

export default () => {
  return (
    <StrictMode>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </StrictMode>
  )
}

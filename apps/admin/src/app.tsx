import { AppRouter } from './app-router'

export default () => {
  return (
    <StrictMode>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </StrictMode>
  )
}

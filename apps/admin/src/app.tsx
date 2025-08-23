import AppRouter from './global/components/app-router'

export default () => {
  return (
    <StrictMode>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </StrictMode>
  )
}

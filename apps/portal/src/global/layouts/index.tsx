import { TopBar } from './top-bar'

export default () => {
  return (
    <div className='app-layout flex h-dvh flex-col'>
      <TopBar />
      <div className='min-h-0'>
        <Outlet />
      </div>
    </div>
  )
}

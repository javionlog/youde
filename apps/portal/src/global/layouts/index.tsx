import { TopBar } from './top-bar'

export default () => {
  return (
    <div className='app-layout mx-auto flex h-dvh max-w-lg flex-col'>
      <TopBar />
      <div className='min-h-0'>
        <Outlet />
      </div>
    </div>
  )
}

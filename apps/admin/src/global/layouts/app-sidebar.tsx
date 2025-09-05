import { createElement } from 'react'
import { AppIcon, MenuFoldIcon, MenuUnfoldIcon, ViewListIcon } from 'tdesign-icons-react'
import type { ResourceNode } from '@/global/api'
import { useScreen } from '../hooks/use-screen'

const { SubMenu, MenuItem } = Menu

interface MenuNodeProps {
  menu: ResourceNode
}

const MenuNode = (props: MenuNodeProps) => {
  const { menu } = props
  const navigate = useNavigate()
  const location = useLocation()
  const routerPath = `/${menu.path}`
  const icon = menu.icon ? createElement(menu.icon!) : <AppIcon />

  return (
    <MenuItem
      value={routerPath}
      onClick={() => {
        if (location.pathname !== routerPath) {
          navigate(routerPath)
        }
      }}
      icon={icon}
    >
      {menu.name}
    </MenuItem>
  )
}

const renderMenuItems = (menus: ResourceNode[]) => {
  return menus
    .filter(o => o.isShow)
    .map(item => {
      if (item.type === 'Menu' && item.children?.length) {
        const icon = item.icon ? createElement(item.icon) : <AppIcon />

        return (
          <SubMenu key={item.id} title={item.name} value={item.id} icon={icon}>
            {renderMenuItems(item.children)}
          </SubMenu>
        )
      }
      return <MenuNode key={item.id} menu={item} />
    })
}

interface SidebarProps {
  menus: ResourceNode[]
}

const MobileMenu = (props: SidebarProps) => {
  const { menus } = props
  const location = useLocation()
  const sidebarCollapsed = useAppStore(state => state.sidebarCollapsed)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    useAppStore.setState({ sidebarCollapsed: !visible })
  }, [visible])

  return (
    <>
      <Drawer
        visible={visible}
        header={false}
        footer={false}
        closeBtn={false}
        placement='left'
        size='50%'
        onClose={() => setVisible(false)}
      >
        <Menu value={location.pathname} collapsed={sidebarCollapsed} className='h-full w-full!'>
          {renderMenuItems(menus)}
        </Menu>
      </Drawer>
      <Button
        className='fixed! bottom-4 left-4 z-[2000]!'
        shape='circle'
        icon={sidebarCollapsed ? <MenuUnfoldIcon /> : <MenuFoldIcon />}
        onClick={() => {
          setVisible(!visible)
        }}
      />
    </>
  )
}

const WideMenu = (props: SidebarProps) => {
  const { menus } = props
  const location = useLocation()
  const sidebarCollapsed = useAppStore(state => state.sidebarCollapsed)

  return (
    <Menu
      value={location.pathname}
      collapsed={sidebarCollapsed}
      operations={
        <Button
          variant='text'
          shape='square'
          icon={<ViewListIcon />}
          onClick={() => useAppStore.setState({ sidebarCollapsed: !sidebarCollapsed })}
        />
      }
      className='max-sm:hidden! h-full'
    >
      {renderMenuItems(menus)}
    </Menu>
  )
}

export const AppSidebar = (props: SidebarProps) => {
  const { isMobile } = useScreen()

  return isMobile ? <MobileMenu {...props} /> : <WideMenu {...props} />
}

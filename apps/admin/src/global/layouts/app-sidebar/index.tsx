import { AppIcon, MenuFoldIcon, MenuUnfoldIcon } from 'tdesign-icons-react'
import type { ResourceNode } from '@/global/api'
import { layoutMenus } from '@/global/router'

const { SubMenu, MenuItem } = Menu

interface MenuNodeProps {
  menu: ResourceNode
}

const MenuNode = (props: MenuNodeProps) => {
  const { menu } = props
  const navigate = useNavigate()
  const location = useLocation()
  const { addTab } = useAppStore()
  const lang = camelCase(useLocaleStore(state => state.lang))
  const menuPath = `/${menu.path}`
  const icon = menu.icon ? createElement(menu.icon!) : <AppIcon />

  const menuLocale = menu.locales?.find(o => o.field === 'name')
  const menuName = menuLocale?.[lang as 'enUs'] ?? menu.name

  return (
    <MenuItem
      value={menu.id}
      icon={icon}
      onClick={() => {
        if (location.pathname !== menuPath) {
          navigate(menuPath)
          addTab(menu)
        }
      }}
    >
      {menuName}
    </MenuItem>
  )
}

const MenuItems = (props: { menus: ResourceNode[]; level?: number }) => {
  const { menus, level = 1 } = props
  const lang = camelCase(useLocaleStore(state => state.lang))
  return (
    <>
      {menus
        .filter(o => o.isShow)
        .map(item => {
          if (item.type === 'Menu' && item.children?.length) {
            const icon = item.icon ? createElement(item.icon) : <AppIcon />
            const menuLocale = item.locales?.find(o => o.field === 'name')
            const menuName = menuLocale?.[lang as 'enUs'] ?? item.name
            return (
              <SubMenu key={item.id} title={menuName} value={item.id} icon={icon} level={level}>
                <MenuItems menus={item.children} level={level + 1} />
              </SubMenu>
            )
          }
          return <MenuNode key={item.id} menu={item} />
        })}
    </>
  )
}

interface SidebarProps {
  menus: ResourceNode[]
}

const MobileMenu = (props: SidebarProps) => {
  const { menus } = props
  const location = useLocation()
  const sidebarCollapsed = useAppStore(state => state.sidebarCollapsed)
  const resources = useResourceStore.getState().getResources()
  const allResources = [...layoutMenus, ...resources]
  const activeResourceItem = allResources.find(o => `/${o.path}` === location.pathname)
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
        size='256px'
        className='drawer-nopadding'
        onClose={() => setVisible(false)}
      >
        <Menu
          value={activeResourceItem?.id}
          collapsed={sidebarCollapsed}
          className='app-sidebar h-full w-full!'
        >
          <MenuItems menus={menus} />
        </Menu>
      </Drawer>
      <Button
        className='fixed! bottom-4 left-4 z-[2000]!'
        shape='circle'
        size='large'
        icon={sidebarCollapsed ? <MenuFoldIcon /> : <MenuUnfoldIcon />}
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
  const resources = useResourceStore.getState().getResources()
  const allResources = [...layoutMenus, ...resources]
  const activeResourceItem = allResources.find(o => `/${o.path}` === location.pathname)

  return (
    <Menu
      value={activeResourceItem?.id}
      collapsed={sidebarCollapsed}
      operations={
        <Button
          variant='text'
          shape='square'
          icon={sidebarCollapsed ? <MenuFoldIcon /> : <MenuUnfoldIcon />}
          onClick={() => useAppStore.setState({ sidebarCollapsed: !sidebarCollapsed })}
        />
      }
      width={'256px'}
      className='app-sidebar max-sm:hidden! h-dvh shrink-0'
    >
      <MenuItems menus={menus} />
    </Menu>
  )
}

export const AppSidebar = (props: SidebarProps) => {
  const { isMobile } = useScreen()

  return isMobile ? <MobileMenu {...props} /> : <WideMenu {...props} />
}

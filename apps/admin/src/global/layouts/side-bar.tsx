import type { ResourceNode } from '@/global/api'

const { SubMenu, MenuItem } = Menu

const MenuNode = (props: { menu: ResourceNode }) => {
  const navigate = useNavigate()
  const routerPath = `/${props.menu.path}`
  return (
    <MenuItem value={routerPath} onClick={() => navigate(routerPath)}>
      {props.menu.name}
    </MenuItem>
  )
}

const renderMenuItems = (menus: ResourceNode[]) => {
  return menus.map(item => {
    if (item.type === 'Menu' && item.children?.length) {
      return (
        <SubMenu key={item.id} title={item.name} value={item.id}>
          {renderMenuItems(item.children)}
        </SubMenu>
      )
    }
    return <MenuNode key={item.id} menu={item} />
  })
}

interface MenuProps {
  menus: ResourceNode[]
}

export const SideBar = memo((props: MenuProps) => {
  const location = useLocation()

  return <Menu value={location.pathname}>{renderMenuItems(props.menus)}</Menu>
})

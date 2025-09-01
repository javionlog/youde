import { createElement } from 'react'
import { AppIcon, ViewListIcon } from 'tdesign-icons-react'
import type { ResourceNode } from '@/global/api'

const { SubMenu, MenuItem } = Menu

const MenuNode = (props: { menu: ResourceNode }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const routerPath = `/${props.menu.path}`
  const icon = props.menu.icon ? createElement(props.menu.icon) : <AppIcon />

  const onClick = () => {
    if (location.pathname !== routerPath) {
      navigate(routerPath)
    }
  }

  return (
    <MenuItem value={routerPath} onClick={onClick} icon={icon}>
      {props.menu.name}
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

interface MenuProps {
  menus: ResourceNode[]
}

export const AppSidebar = memo((props: MenuProps) => {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(true)

  const onClick = () => {
    setCollapsed(!collapsed)
  }

  return (
    <Menu
      value={location.pathname}
      collapsed={collapsed}
      operations={
        <Button variant='text' shape='square' icon={<ViewListIcon />} onClick={onClick} />
      }
      className='h-full'
    >
      {renderMenuItems(props.menus)}
    </Menu>
  )
})

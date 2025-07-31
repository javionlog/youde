import type { PostAuthRbacListUserResourceTreeResponse } from '@/modules/shared/api'

const { SubMenu, MenuItem } = Menu

const renderMenuItems = (menus: PostAuthRbacListUserResourceTreeResponse) => {
  return menus.map(item => {
    if (item.type === 'Menu' && item.children?.length) {
      return (
        <SubMenu key={item.id} title={item.name} value={item.id}>
          {renderMenuItems(item.children)}
        </SubMenu>
      )
    }
    return (
      <MenuItem key={item.id} value={item.id}>
        {item.name}
      </MenuItem>
    )
  })
}

interface IMenuProps {
  menus: PostAuthRbacListUserResourceTreeResponse
}

export const SideBar = (props: IMenuProps) => {
  return <Menu>{renderMenuItems(props.menus)}</Menu>
}

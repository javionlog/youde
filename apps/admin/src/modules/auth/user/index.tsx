import { postAuthRbacListUsers } from '@/global/api'

type SearchProps = Parameters<typeof GlSearch>[0]

export default () => {
  const { t } = useTranslation()
  const search = {
    items: [
      {
        formItem: {
          name: 'username',
          label: t('label.username')
        },
        component: <Input />
      }
    ]
  } satisfies SearchProps

  const columns = [
    {
      colKey: 'id',
      title: 'ID'
    },
    {
      colKey: 'name',
      title: '姓名'
    },
    {
      colKey: 'username',
      title: '用户名'
    },
    {
      colKey: 'displayUsername',
      title: '显示名'
    },
    {
      colKey: 'email',
      title: '邮箱'
    },
    {
      colKey: 'emailVerified',
      title: '邮箱是否已验证',
      cellRenderType: 'boolean'
    },
    {
      colKey: 'createdAt',
      title: '创建时间',
      cellRenderType: 'datetime'
    },
    {
      colKey: 'updatedAt',
      title: '更新时间',
      cellRenderType: 'datetime'
    }
  ] satisfies TalbeColumns

  return <GlTable rowKey='id' search={search} columns={columns} fetch={postAuthRbacListUsers} />
}

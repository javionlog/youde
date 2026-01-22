import type { GetAdminTreasureResponse, TreasureCategoryNode } from '@/global/api'
import { postAdminTreasureList } from '@/global/api'

interface Props {
  rowData: TreasureCategoryNode
}

export const ViewTreasureBtn = (props: Props) => {
  const { rowData } = props
  const { t } = useTranslation()

  const columns = [
    {
      colKey: 'categoryId',
      title: t('treasure.label.category', { ns: 'content' }),
      cell: ({ row }) => {
        return useTreasureStore.getState().getCategoryName(row.categoryId)
      }
    },
    {
      colKey: 'fee',
      title: t('label.fee'),
      cellRenderType: 'enum',
      enumKey: 'TREASURE_FEE'
    },
    {
      colKey: 'title',
      title: t('label.title')
    },
    {
      colKey: 'description',
      title: t('label.description')
    },
    {
      colKey: 'url',
      title: t('label.url')
    },
    {
      colKey: 'status',
      title: t('label.status'),
      cellRenderType: 'enum',
      enumKey: 'TREASURE_STATUS'
    },
    {
      colKey: 'createdAt',
      title: t('label.createdAt'),
      cellRenderType: 'datetime'
    },
    {
      colKey: 'updatedAt',
      title: t('label.updatedAt'),
      cellRenderType: 'datetime'
    },
    {
      colKey: 'createdBy',
      title: t('label.createdBy')
    },
    {
      colKey: 'updatedBy',
      title: t('label.updatedBy')
    }
  ] satisfies GlTalbeColumns<GetAdminTreasureResponse>

  const onOpen = () => {
    const dialogInstance = GlDialogPlugin({
      onClose: () => {
        dialogInstance.hide()
      },
      header: t('treasure.action.viewAssociatedTreasure', { ns: 'content' }),
      footer: false,
      body: (
        <GlTable
          rowKey='id'
          columns={columns}
          maxHeight='100%'
          params={{ categoryIds: [rowData.id] }}
          api={postAdminTreasureList}
        />
      )
    })
  }

  return (
    <div onClick={onOpen}>{t('treasure.action.viewAssociatedTreasure', { ns: 'content' })}</div>
  )
}

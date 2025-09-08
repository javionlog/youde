type GlSearchFormProps = Parameters<typeof GlSearchForm>[0]
export default () => {
  const items = [
    {
      formItemProps: {
        name: 'prop1'
      },
      component: <Input />
    },
    {
      formItemProps: {
        name: 'prop2'
      },
      component: <Input />
    },
    {
      formItemProps: {
        name: 'prop3'
      },
      component: <Input />
    },
    {
      formItemProps: {
        name: 'prop4'
      },
      component: <Input />
    },
    {
      formItemProps: {
        name: 'prop5'
      },
      component: <Input />
    },
    {
      formItemProps: {
        name: 'prop6'
      },
      component: <Input />
    },
    {
      formItemProps: {
        name: 'prop7'
      },
      component: <Input />
    }
  ] satisfies GlSearchFormProps['items']

  return (
    <div>
      <GlSearchForm items={items}></GlSearchForm>
    </div>
  )
}

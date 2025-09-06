export default () => {
  const list = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' },
    {
      id: 4,
      name: 'Item 4',
      column: {
        xs: { span: 2, offset: 2 },
        sm: { span: 2, offset: 2 },
        md: { span: 2, offset: 2 },
        lg: { span: 2, offset: 2 },
        xl: { span: 2, offset: 2 },
        '2xl': { span: 2, offset: 2 }
      }
    },
    { id: 5, name: 'Item 5' },
    { id: 6, name: 'Item 6' },
    { id: 7, name: 'Item 7' }
  ]
  return (
    <div>
      <GlGrid>
        {list.map(item => (
          <GlGridItem key={item.id} column={item.column}>
            {item.name}
          </GlGridItem>
        ))}
      </GlGrid>
    </div>
  )
}

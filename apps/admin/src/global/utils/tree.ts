type TreeNode<T, K extends number | string> = T & {
  [_K in K]: TreeNode<T, K>[]
}
export const flattenTree = <T extends Record<string | number, unknown>, C extends keyof T>(
  tree: T[] = [],
  props?: { children?: C; isDepthFirst?: boolean }
) => {
  const { children = 'children', isDepthFirst = true } = props ?? {}
  const stack = JSON.parse(JSON.stringify(tree)) as T[]
  const result: T[] = []
  while (stack.length > 0) {
    const topItem = stack.shift()
    if (topItem) {
      result.push(topItem)
      const items = topItem[children]
      if (Array.isArray(items)) {
        if (isDepthFirst) {
          stack.unshift(...items)
        } else {
          stack.push(...items)
        }
      }
    }
  }
  for (const item of result) {
    Reflect.deleteProperty(item, children)
  }
  return result
}

export const buildTree = <
  T extends Record<number | string, any>,
  K extends keyof T & (number | string),
  C extends number | string = 'children'
>(
  list: T[],
  props?: {
    parentId?: K
    id?: K
    children?: C
    judgeParentFn?: (item: T) => boolean
  }
): TreeNode<T, C>[] => {
  const {
    parentId = 'parentId',
    id = 'id',
    children = 'children',
    judgeParentFn = (item: T) => isEmpty(item[parentId])
  } = props ?? {}
  const result: TreeNode<T, C>[] = []
  const idMap: {
    [key: number | string]: TreeNode<T, C>
  } = {}

  for (const item of list) {
    idMap[item[id]] = { ...item, [children]: [] }
  }

  for (const item of list) {
    const pId = item[parentId]
    const cId = item[id]
    if (judgeParentFn(item)) {
      result.push(idMap[cId] as TreeNode<T, C>)
    } else {
      const mapItem = idMap[pId]
      mapItem[children].push(idMap[cId])
    }
  }

  return result
}

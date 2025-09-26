type TreeNode<T, K extends number | string> = T & {
  [_K in K]: TreeNode<T, K>[]
}
export const flattenTree = <T extends Record<string | number, any>, C extends keyof T>(
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
      const items = topItem[children] as any[]
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
  K extends keyof T,
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
      if (mapItem) {
        mapItem[children].push(idMap[cId])
      }
    }
  }

  return result
}

export const getParentNodes = <
  T extends Record<string | number, any>,
  K extends keyof T,
  C extends number | string = 'children'
>(
  tree: T[],
  targetId: T[K],
  props?: {
    parentId?: K
    id?: K
    children?: C
  }
): T[] => {
  const { parentId = 'parentId', id = 'id' } = props ?? {}
  const flatTree = flattenTree(tree, props)
  const nodeMap = new Map<T[K], T>()
  for (const item of flatTree) {
    nodeMap.set(item[id] as T[K], item)
  }

  const result: T[] = []
  let currentId = targetId

  while (true) {
    const currentNode = nodeMap.get(currentId)
    if (isEmpty(currentNode)) {
      break
    }

    const pId = currentNode[parentId] as T[K]
    if (isEmpty(pId)) {
      break
    }

    const parentNode = nodeMap.get(pId)

    if (isEmpty(parentNode)) {
      break
    }
    result.unshift(parentNode)

    currentId = pId
  }

  return result
}

export const getChildrenNodes = <
  T extends Record<string | number, any>,
  K extends keyof T,
  C extends number | string = 'children'
>(
  tree: T[],
  targetId: T[K],
  props?: {
    parentId?: K
    id?: K
    children?: C
    isDepthFirst?: boolean
  }
): T[] => {
  const { parentId = 'parentId', id = 'id', isDepthFirst = true } = props ?? {}
  const flatTree = flattenTree(tree, props)

  const childrenMap = new Map<T[K], T[]>()

  for (const item of flatTree) {
    const pId = item[parentId] as T[K]
    if (isEmpty(pId)) {
      continue
    }
    if (!childrenMap.has(pId)) {
      childrenMap.set(pId, [])
    }
    childrenMap.get(pId)?.push(item)
  }

  const result: T[] = []
  const stack: T[] = []

  const initialChildren = childrenMap.get(targetId) ?? []
  stack.push(...initialChildren)

  while (stack.length) {
    const currentNode = isDepthFirst ? stack.pop()! : stack.shift()!
    result.push(currentNode)

    const currentChildren = childrenMap.get(currentNode[id] as T[K]) ?? []
    stack.push(...currentChildren)
  }

  return result
}

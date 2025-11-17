import { consola } from 'consola'
import { sql } from 'drizzle-orm'
import { db } from '@/db'
import { SYSTEM_OPERATOR } from '@/global/config'
import { createAdminResource } from '@/modules/admin/auth/resource/services'
import type { RowType as ResourceRowType } from '@/modules/admin/auth/resource/specs'
import { createAdminResourceLocale } from '@/modules/admin/auth/resource-locale/services'
import { createAdminRole } from '@/modules/admin/auth/role/services'
import { createAdminRoleResourceRelation } from '@/modules/admin/auth/role-resource-relation/services'
import { createAdminUserRoleRelation } from '@/modules/admin/auth/user-role-relation/services'
import { createAdminUser } from '@/modules/admin/user/services'
import { createCategory } from '@/modules/common/category/services'
import { createCategoryLocale } from '@/modules/common/category-locale/services'

const reset = async () => {
  const tableSchema = db._.schema
  if (!tableSchema) {
    return
  }
  const queries = Object.values(tableSchema).map(table => {
    return sql.raw(`TRUNCATE TABLE public.${table.dbName} CASCADE;`)
  })

  await Promise.all(
    queries.map(async query => {
      if (query) {
        return await db.execute(query)
      }
    })
  )
}

type ResourceType = ResourceRowType['type']

const init = async () => {
  /* Create user */
  const userRes = await createAdminUser({
    createdByUsername: SYSTEM_OPERATOR,
    enabled: true,
    isAdmin: true,
    username: 'admin',
    password: 'Admin888@@'
  })

  /* Create role */
  const roleIds: string[] = []
  const roleCommonFileds = {
    createdByUsername: SYSTEM_OPERATOR,
    enabled: true
  }
  const roleDatas = [
    {
      name: 'Super Admin'
    }
  ]
  for (let i = 0; i < roleDatas.length; i++) {
    const roleRes = await createAdminRole({
      ...roleCommonFileds,
      name: 'Super Admin'
    })
    roleIds.push(roleRes.id)
  }

  /* Create resource */
  const resourceIds: string[] = []
  const resourceCommonFileds = {
    createdByUsername: SYSTEM_OPERATOR,
    enabled: true,
    isShow: true,
    isCache: true,
    isAffix: false,
    isLink: false
  }
  const resourceLocaleCommonFileds = {
    createdByUsername: SYSTEM_OPERATOR,
    field: 'name' as 'name'
  }
  const resourceDatas = [
    {
      name: 'Auth Management',
      enUs: 'Auth Management',
      zhCn: '权限管理',
      type: 'Menu',
      children: [
        {
          name: 'User Management',
          enUs: 'User Management',
          zhCn: '用户管理',
          type: 'Page',
          path: 'auth/user'
        },
        {
          name: 'Role Management',
          enUs: 'Role Management',
          zhCn: '角色管理',
          type: 'Page',
          path: 'auth/role'
        },
        {
          name: 'Resource Management',
          enUs: 'Resource Management',
          zhCn: '资源管理',
          type: 'Page',
          path: 'auth/resource'
        }
      ]
    }
  ]
  for (let i = 0; i < resourceDatas.length; i++) {
    const item = resourceDatas[i]
    const resourceRes = await createAdminResource({
      ...resourceCommonFileds,
      type: item.type as ResourceType,
      name: item.name,
      sort: i + 1
    })
    resourceIds.push(resourceRes.id)
    await createAdminResourceLocale({
      ...resourceLocaleCommonFileds,
      resourceId: resourceRes.id,
      enUs: item.enUs,
      zhCn: item.zhCn
    })
    for (let j = 0; j < item.children.length; j++) {
      const subItem = item.children[j]
      const subResourceRes = await createAdminResource({
        ...resourceCommonFileds,
        parentId: resourceRes.id,
        path: subItem.path,
        type: subItem.type as ResourceType,
        name: subItem.name,
        sort: j + 1
      })
      resourceIds.push(subResourceRes.id)
      await createAdminResourceLocale({
        ...resourceLocaleCommonFileds,
        resourceId: subResourceRes.id,
        enUs: subItem.enUs,
        zhCn: subItem.zhCn
      })
    }
  }

  /* Create user, role, resource relation */
  for (const roleId of roleIds) {
    await createAdminUserRoleRelation({
      createdByUsername: SYSTEM_OPERATOR,
      userId: userRes.id,
      roleId
    })
    for (const resourceId of resourceIds) {
      await createAdminRoleResourceRelation({
        createdByUsername: SYSTEM_OPERATOR,
        roleId,
        resourceId
      })
    }
  }

  /* Create category */
  const categoryCommonFields = {
    userId: userRes.id,
    username: userRes.username,
    enabled: true
  }

  const categoryLocaleCommonFields = {
    userId: userRes.id,
    username: userRes.username,
    field: 'name' as 'name'
  }

  const categoryDatas = [
    {
      name: 'Technology',
      enUs: 'Technology',
      zhCn: '技术',
      children: [
        {
          name: 'Editor',
          enUs: 'Editor',
          zhCn: '编辑器'
        },
        {
          name: 'Database',
          enUs: 'Database',
          zhCn: '数据库'
        },
        {
          name: 'Network',
          enUs: 'Network',
          zhCn: '网络'
        },
        {
          name: 'Debugging',
          enUs: 'Debugging',
          zhCn: '调试'
        },
        {
          name: 'File',
          enUs: 'File',
          zhCn: '文件'
        },
        {
          name: 'Project Management',
          enUs: 'Project Management',
          zhCn: '项目管理'
        },
        {
          name: 'Mind Map',
          enUs: 'Mind Map',
          zhCn: '思维导图'
        }
      ]
    },
    {
      name: 'Multimedia',
      enUs: 'Multimedia',
      zhCn: '多媒体',
      children: [
        {
          name: 'Design',
          enUs: 'Design',
          zhCn: '设计'
        },
        {
          name: 'Image',
          enUs: 'Image',
          zhCn: '图片'
        },
        {
          name: 'Video',
          enUs: 'Video',
          zhCn: '视频'
        },
        {
          name: 'Modeling',
          enUs: 'Modeling',
          zhCn: '建模'
        },
        {
          name: 'Material',
          enUs: 'Material',
          zhCn: '素材'
        }
      ]
    },
    {
      name: 'Office',
      enUs: 'Office',
      zhCn: '办公',
      children: [
        {
          name: 'Note',
          enUs: 'Note',
          zhCn: '笔记'
        },
        {
          name: 'Team Collaboration',
          enUs: 'Team Collaboration',
          zhCn: '团队协作'
        },
        {
          name: 'Time Management',
          enUs: 'Time Management',
          zhCn: '时间管理'
        },
        {
          name: 'Screen Capture',
          enUs: 'Screen Capture',
          zhCn: '截屏'
        }
      ]
    },
    {
      name: 'Study',
      enUs: 'Study',
      zhCn: '学习',
      children: [
        {
          name: 'Online Course',
          enUs: 'Online Course',
          zhCn: '在线课程'
        },
        {
          name: 'Knowledge Community',
          enUs: 'Knowledge Community',
          zhCn: '知识社区'
        },
        {
          name: 'Language Learning',
          enUs: 'Language Learning',
          zhCn: '语言学习'
        },
        {
          name: 'Programming Learning',
          enUs: 'Programming Learning',
          zhCn: '编程学习'
        }
      ]
    },
    {
      name: 'Entertainment',
      enUs: 'Entertainment',
      zhCn: '娱乐',
      children: [
        {
          name: 'Movie',
          enUs: 'Movie',
          zhCn: '影视'
        },
        {
          name: 'Music',
          enUs: 'Music',
          zhCn: '音乐'
        },
        {
          name: 'Anime',
          enUs: 'Anime',
          zhCn: '动漫'
        },
        {
          name: 'E-book',
          enUs: 'E-book',
          zhCn: '电子书'
        }
      ]
    },
    {
      name: 'Life',
      enUs: 'Life',
      zhCn: '生活',
      children: [
        {
          name: 'Shipping',
          enUs: 'Shipping',
          zhCn: '购物'
        }
      ]
    }
  ]
  for (let i = 0; i < categoryDatas.length; i++) {
    const item = categoryDatas[i]
    const categoryRes = await createCategory({
      ...categoryCommonFields,
      name: item.name,
      sort: i + 1
    })
    await createCategoryLocale({
      ...categoryLocaleCommonFields,
      categoryId: categoryRes.id,
      enUs: item.enUs,
      zhCn: item.zhCn
    })
    for (let j = 0; j < item.children.length; j++) {
      const subItem = item.children[j]
      const subCategoryRes = await createCategory({
        ...categoryCommonFields,
        parentId: categoryRes.id,
        name: subItem.name,
        sort: j + 1
      })
      await createCategoryLocale({
        ...categoryLocaleCommonFields,
        categoryId: subCategoryRes.id,
        enUs: subItem.enUs,
        zhCn: subItem.zhCn
      })
    }
  }
}

consola.info('init db start')
await reset()
await init()
consola.info('init db end')
process.exit()

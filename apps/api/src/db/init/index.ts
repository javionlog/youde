import { consola } from 'consola'
import { sql } from 'drizzle-orm'
import { db } from '@/db'
import { auth } from '@/modules/auth/services'
import { createCategory } from '@/modules/category/services'
import { createCategoryLocale } from '@/modules/category-locale/services'

const { api } = auth

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

const init = async () => {
  const _userRes = (await api.signUpEmail({
    body: {
      name: 'admin',
      username: 'admin',
      email: 'admin@example.com',
      password: '12345678'
    }
  }))!
  type UserRes = typeof _userRes
  const userRes = _userRes as {
    token: UserRes['token']
    user: UserRes['user'] & { username: string }
  }
  const roleRes = (await api.createRole({
    body: {
      name: 'Super Admin',
      enabled: true
    }
  }))!
  const resourceRes1 = (await api.createResource({
    body: {
      name: 'Auth Management',
      type: 'Menu',
      sort: 1,
      enabled: true,
      isShow: true
    }
  }))!
  await api.createResourceLocale({
    body: {
      resourceId: resourceRes1.id,
      field: 'name',
      enUs: 'Auth Management',
      zhCn: '权限管理'
    }
  })
  const resourceRes2 = (await api.createResource({
    body: {
      parentId: resourceRes1?.id,
      name: 'User Management',
      type: 'Page',
      path: 'auth/user',
      sort: 2,
      enabled: true,
      isCache: true,
      isShow: true
    }
  }))!
  await api.createResourceLocale({
    body: {
      resourceId: resourceRes2.id,
      field: 'name',
      enUs: 'User Management',
      zhCn: '用户管理'
    }
  })
  const resourceRes3 = (await api.createResource({
    body: {
      parentId: resourceRes1?.id,
      name: 'Role Management',
      type: 'Page',
      path: 'auth/role',
      sort: 3,
      enabled: true,
      isCache: true,
      isShow: true
    }
  }))!
  await api.createResourceLocale({
    body: {
      resourceId: resourceRes3.id,
      field: 'name',
      enUs: 'Role Management',
      zhCn: '角色管理'
    }
  })
  const resourceRes4 = (await api.createResource({
    body: {
      parentId: resourceRes1?.id,
      name: 'Resource Management',
      type: 'Page',
      path: 'auth/resource',
      sort: 4,
      enabled: true,
      isCache: true,
      isShow: true
    }
  }))!
  await api.createResourceLocale({
    body: {
      resourceId: resourceRes4.id,
      field: 'name',
      enUs: 'Resource Management',
      zhCn: '资源管理'
    }
  })
  const resourceIds = [resourceRes1.id, resourceRes2.id, resourceRes3.id, resourceRes4.id]
  const roleIds = [roleRes.id]
  for (const id of resourceIds) {
    await api.createRoleResourceRelation({
      body: {
        roleId: roleRes.id,
        resourceId: id
      }
    })
  }
  for (const id of roleIds) {
    await api.createUserRoleRelation({
      body: {
        userId: userRes.user.id,
        roleId: id
      }
    })
  }

  const categoryCommonFields = {
    userId: userRes.user.id,
    username: userRes.user.username
  }

  const categoryData = [
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

  for (const item of categoryData) {
    await createCategory({
      ...categoryCommonFields,
      name: item.name
    }).then(async res => {
      await createCategoryLocale({
        ...categoryCommonFields,
        categoryId: res.id,
        field: 'name',
        enUs: item.enUs,
        zhCn: item.zhCn
      })
      for (const subItem of item.children) {
        await createCategory({
          ...categoryCommonFields,
          parentId: res.id,
          name: subItem.name
        }).then(async res => {
          await createCategoryLocale({
            ...categoryCommonFields,
            categoryId: res.id,
            field: 'name',
            enUs: subItem.enUs,
            zhCn: subItem.zhCn
          })
        })
      }
    })
  }
}

consola.info('init db start')
await reset()
await init()
consola.info('init db end')
process.exit()

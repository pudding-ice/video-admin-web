import Vue from 'vue'
import Router from 'vue-router'
/* Layout */
import Layout from '@/layout'

Vue.use(Router)

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },

  {
    path: '/author',
    component: Layout,
    redirect: '/author/list',
    name: '创作者管理',
    meta: { title: '创作者管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'list',
        name: '创作者列表',
        component: () => import('@/views/video/author/list'),
        meta: { title: '创作者列表', icon: 'table' }
      },
      {
        path: 'form',
        name: '添加创作者',
        component: () => import('@/views/video/author/form'),
        meta: { title: '添加创作者', icon: 'form' }
      },
      {
        path: 'edit/:id',
        name: '编辑',
        component: () => import('@/views/video/author/form'),
        meta: { title: '编辑', icon: 'tree' },
        hidden: true
      }
    ]
  },
  {
    path: '/content',
    component: Layout,
    redirect: '/content/list',
    name: '视频管理',
    meta: { title: '视频管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'list',
        name: '视频列表',
        component: () => import('@/views/video/content/list'),
        meta: { title: '视频列表', icon: 'table' }
      },
      {
        path: 'add',
        name: '添加作品',
        component: () => import('@/views/video/content/add'),
        meta: {title: '添加作品', icon: 'tree'},
        // hidden: true

      },
      {
        path: 'chapter',
        name: '章节信息',
        component: () => import('@/views/video/content/chapter'),
        meta: {title: '章节信息', icon: 'tree'},
        hidden: true
      },
      {
        path: 'send',
        name: '最终发布',
        component: () => import('@/views/video/content/send'),
        meta: {title: '最终发布', icon: 'tree'},
        hidden: true
      }
    ]
  },

  {
    path: '/category',
    component: Layout,
    redirect: '/category/list',
    children: [
      {
        path: 'list',
        name: '视频分类列表',
        component: () => import('@/views/video/category/list'),
        meta: { title: '视频分类列表', icon: 'form' }
      }
    ]
  },

  {
    path: '/data',
    component: Layout,
    redirect: '/data/index',
    name: '数据导入导出',
    meta: {
      title: '数据导入导出',
      icon: 'nested'
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/video/data/index-data'), // Parent router-view
        name: '数据处理首页',
        meta: { title: '数据处理首页' }
      },
      {
        path: 'category',
        component: () => import('@/views/video/data/category-data'), // Parent router-view
        name: '视频分类数据',
        meta: { title: '视频分类数据' }
      },
      {
        path: 'author',
        component: () => import('@/views/video/data/author-data'), // Parent router-view
        name: '视频作者数据',
        meta: { title: '视频作者数据' }
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

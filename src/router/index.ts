import Vue from 'vue'
import VueRouter from 'vue-router'
import layout from '@/components/layout/index.vue';

Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location: any) {
  // 解决路由重复报错问题
  return (originalPush.call(this, location) as any).catch((err: any) => err)
}

export const routes = [
  {
      path: '/',
      name: 'main',
      redirect: '/application',
      component: layout,
      children: [
        {
            path: '/application',
            name: 'Application',
            component: () => import(/* webpackChunkName: "application" */ '@/views/application/index.vue'),
        },
        {
            path: '/release',
            name: 'Release',
            component: () => import(/* webpackChunkName: "release" */ '@/views/release/index.vue'),
        },
        {
            path: '/intention',
            name: 'Intention',
            component: () => import(/* webpackChunkName: "intention" */ '@/views/intention/index.vue'),
            children: [
                {
                    path: '/intention/test',
                    name: 'intentionTest',
                    component: () => import(/* webpackChunkName: "intention" */ '@/views/intention/test.vue'),
                }
            ]
        },
        // {
        //     path: '/intention/test',
        //     name: 'intentionTest',
        //     component: () => import(/* webpackChunkName: "intention" */ '@/views/intention/test.vue'),
        // },
        {
            path: '/wordset',
            name: 'Wordset',
            component: () => import(/* webpackChunkName: "wordset" */ '@/views/wordset/index.vue'),
        },
        {
            path: '/system',
            name: 'System',
            component: () => import(/* webpackChunkName: "system" */ '@/views/system/index.vue'),
        },
        {
            path: '/qalib',
            name: 'Qalib',
            component: () => import(/* webpackChunkName: "qalib" */ '@/views/qalib/index.vue'),
        },
        {
            path: '/document',
            name: 'Document',
            component: () => import(/* webpackChunkName: "document" */ '@/views/document/index.vue'),
        },
        {
            path: '/extract',
            name: 'Extract',
            component: () => import(/* webpackChunkName: "extract" */ '@/views/extract/index.vue'),
        },
        {
            path: '/statistical',
            name: 'Statistical',
            component: () => import(/* webpackChunkName: "statistical" */ '@/views/statistical/index.vue'),
        },
      ],
  },
]

const router = new VueRouter({
    base: (window as any).__POWERED_BY_QIANKUN__ ? '/knowledge/' : '/',
    mode: 'hash',
    routes,
  });

export default router

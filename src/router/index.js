import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import ParentView from '@/components/ParentView';

/**
 * Note: 路由配置项
 *
 * hidden: true                   // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true               // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect           // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'             // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
    noCache: true                // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    title: 'title'               // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'             // 设置该路由的图标，对应路径src/assets/icons/svg
    breadcrumb: false            // 如果设置为false，则不会在breadcrumb面包屑中显示
  }
 */

// 公共路由
export const constantRoutes = [{
        path: '/redirect',
        component: Layout,
        hidden: true,
        children: [{
            path: '/redirect/:path(.*)',
            component: (resolve) => require(['@/views/redirect'], resolve)
        }]
    },
    {
        path: '/login',
        component: (resolve) => require(['@/views/login'], resolve),
        hidden: true
    },
    {
        path: '/404',
        component: (resolve) => require(['@/views/error/404'], resolve),
        hidden: true
    },
    {
        path: '/401',
        component: (resolve) => require(['@/views/error/401'], resolve),
        hidden: true
    },
    {
        path: '',
        component: Layout,
        redirect: 'index',
        children: [{
            path: 'index',
            component: (resolve) => require(['@/views/index'], resolve),
            name: '首页',
            meta: { title: '首页', icon: 'dashboard', noCache: true, affix: true }
        }]
    },
    {
        path: '/user',
        component: Layout,
        hidden: true,
        redirect: 'noredirect',
        children: [{
            path: 'profile',
            component: (resolve) => require(['@/views/system/user/profile/index'], resolve),
            name: 'Profile',
            meta: { title: '个人中心', icon: 'user' }
        }]
    },
    {
        path: '/dict',
        component: Layout,
        hidden: true,
        children: [{
            path: 'type/data/:dictId(\\d+)',
            component: (resolve) => require(['@/views/system/dict/data'], resolve),
            name: 'Data',
            meta: { title: '字典数据', icon: '' }
        }]
    },
    {
        path: '/job',
        component: Layout,
        hidden: true,
        children: [{
            path: 'log',
            component: (resolve) => require(['@/views/monitor/job/log'], resolve),
            name: 'JobLog',
            meta: { title: '调度日志' }
        }]
    },
    {
        path: '/gen',
        component: Layout,
        hidden: true,
        children: [{
            path: 'edit/:tableId(\\d+)',
            component: (resolve) => require(['@/views/tool/gen/editTable'], resolve),
            name: 'GenEdit',
            meta: { title: '修改生成配置' }
        }]
    },
    {
        alwaysShow: true,
        children: [{
            component: (resolve) => require(['@/views/renwu/renwulist/index'], resolve),
            hidden: false,
            meta: { title: "任务列表", noCache: false },
            name: "Renwulist",
            path: "renwulist",
        }, {
            component: (resolve) => require(['@/views/checkdetail/index'], resolve),
            hidden: true,
            meta: { title: "查看明细", noCache: false },
            name: "Checkdetail",
            path: "/renwu/checkdetail",
        }],
        component: Layout,
        hidden: false,
        meta: { title: "任务管理", icon: "cascader", noCache: false },
        name: "Renwu",
        path: "/renwu",
        redirect: "noRedirect"
    },
    {
        alwaysShow: true,
        children: [{
            component: (resolve) => require(['@/views/confirmobj/netcheck/index'], resolve),
            hidden: false,
            meta: { title: "实施网审", noCache: false },
            name: "Netcheck",
            path: "netcheck",
        }, {
            component: (resolve) => require(['@/views/confirmobj/duixqd/index'], resolve),
            hidden: false,
            meta: { title: "对象确定", noCache: false },
            name: "Duixqd",
            path: "duixqd",
        }],
        component: Layout,
        hidden: false,
        meta: { title: "确定对象", icon: "cascader", noCache: false },
        name: "Confirmobj",
        path: "/confirmobj",
        redirect: "noRedirect"
    },
    {
        alwaysShow: true,
        children: [{
            component: (resolve) => require(['@/views/checkup/renwupf/index'], resolve),
            hidden: false,
            meta: { title: "任务派发", noCache: false },
            name: "Renwupf",
            path: "renwupf",
        }, {
            component: (resolve) => require(['@/views/checkup/dayintz/index'], resolve),
            hidden: false,
            meta: { title: "打印通知", noCache: false },
            name: "Dayintz",
            path: "dayintz",
        }, {
            component: (resolve) => require(['@/views/checkup/jianchass/index'], resolve),
            hidden: false,
            meta: { title: "检查实施", noCache: false },
            name: "Jianchass",
            path: "jianchass",
        }, {
            component: (resolve) => require(['@/views/checkup/diaochaqz/index'], resolve),
            hidden: false,
            meta: { title: "调查取证", noCache: false },
            name: "Diaochaqz",
            path: "diaochaqz"
        }, {
            hidden: true,
            component: (resolve) => require(['@/views/checkup/diaochaqz/dcqz.vue'], resolve),
            meta: { title: "调查取证", noCache: false },
            name: "Dcqz",
            path: "diaochaqz/dcqz",
        }, {
            component: (resolve) => require(['@/views/checkup/xingchengjg/index'], resolve),
            hidden: false,
            meta: { title: "形成结果", noCache: false },
            name: "Xingchengjg",
            path: "xingchengjg",
        }],
        component: Layout,
        hidden: false,
        meta: { title: "实施检查", icon: "cascader", noCache: false },
        name: "Checkup",
        path: "/checkup",
        redirect: "noRedirect"
    },
    {
        alwaysShow: true,
        children: [{
            component: (resolve) => require(['@/views/baseinfosave/renyuanwh/index'], resolve),
            hidden: false,
            meta: { title: "网络人员维护", noCache: false },
            name: "Renyuanwh",
            path: "renyuanwh",
        }, {
            component: (resolve) => require(['@/views/baseinfosave/jianchazuwh/index'], resolve),
            hidden: false,
            meta: { title: "检查组维护", noCache: false },
            name: "Jianchazuwh",
            path: "jianchazuwh",
        }, {
            component: (resolve) => require(['@/views/baseinfosave/zhanghaowh/index'], resolve),
            hidden: false,
            meta: { title: "账号及权限维护", noCache: false },
            name: "Zhanghaowh",
            path: "zhanghaowh",
        }, {
            component: (resolve) => require(['@/views/baseinfosave/luliwh/index'], resolve),
            hidden: false,
            meta: { title: "履历维护", noCache: false },
            name: "Luliwh",
            path: "luliwh",
        }],
        component: Layout,
        hidden: false,
        meta: { title: "基础信息维护", icon: "cascader", noCache: false },
        name: "Baseinfosave",
        path: "/baseinfosave",
        redirect: "noRedirect"
    },
    {
        alwaysShow: true,
        children: [{
            component: (resolve) => require(['@/views/thirdcheck/thirdcheck/index'], resolve),
            hidden: false,
            meta: { title: "任务列表", noCache: false },
            name: "Rhirdcheck",
            path: "thirdcheck",
        }],
        component: Layout,
        hidden: false,
        meta: { title: "第三方筛查", icon: "cascader", noCache: false },
        name: "Thirdcheck",
        path: "/thirdcheck",
        redirect: "noRedirect"
    },
]

export default new Router({
    mode: 'history', // 去掉url中的#
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
})
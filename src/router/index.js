import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
// eslint-disable-next-line no-unused-vars
import Users from '../components/user/Users'
const routerPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return routerPush.call(this, location).catch(error => error)
}
Vue.use(Router)

// eslint-disable-next-line no-undef
const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/home',
      component: Home,
      redirect: '/welcome',
      // eslint-disable-next-line standard/object-curly-even-spacing
      children: [{ path: '/welcome', component: Welcome }, { path: '/users', component: Users }]
    }

  ]
})

router.beforeEach((to, from, next) => {
// to 将要访问的路径
// from 代表从哪个路径跳转而来
// next 是一个函数,表示放行
  if (to.path === '/login') return next()
  //  获取token
  // eslint-disable-next-line no-unused-vars
  const tokenStr = window.sessionStorage.getItem('token')
  // eslint-disable-next-line no-undef
  if (!tokenStr) return next('/login')
  next()
})
export default router

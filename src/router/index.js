import { route } from 'quasar/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE)
  })

  Router.beforeEach((to, from, next) => {
    if (to.name != 'login' && !sessionStorage.user) {
      Router.push({ name: "login" })
    }
    setInterval(() => {
      if (!sessionStorage.user) {
        Router.push({ name: "login" })
      }
    }, 1500)

    if (to.name == 'cadastrar' && sessionStorage.nivelAcc != 'Admin') {
      Router.push({ name: "semAcesso" })
    }

    if (to.name == 'cadastrarFuncionarios' && sessionStorage.nivelAcc != 'Admin') {
      Router.push({ name: "semAcesso" })
    }
    next()

  });


  return Router
})


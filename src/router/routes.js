
const routes = [
  {
    path: '/',
    name: "login",
    component: () => import('pages/LoginInicial.vue'),
  },
  {
    path: '/dashboard',

    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '', component: () => import('pages/IndexPage.vue'),
        name: "principal"
      },
      {
        path: '/cadastrar', component: () => import('pages/cadastrarVeiculo.vue'),
        name: "cadastrar"
      },
      {
        path: '/pesquisar', component: () => import('pages/pesquisarVeiculos.vue'),
        name: "pesquisar"
      },
      {
        path: '/listarVeiculos/:id', component: () => import('pages/listarVeiculos.vue'),
        name: "listarVeiculos"
      },
      {
        path: '/cadastrarFuncionarios', component: () => import('pages/cadastrarFuncionarios.vue'),
        name: "cadastrarFuncionarios"
      },
      {
        path: '/listarFuncionarios', component: () => import('pages/listarFuncionarios.vue'),
        name: "listarFuncionarios"
      }
    ]
  },



  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
    name: 'semAcesso'
  }
]

export default routes

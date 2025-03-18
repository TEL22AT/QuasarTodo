const routes = [
  {
    path: '/',
    component: () => import('layouts/MovieLayout.vue'),
    children: [
      { path: '', component: () => import('pages/MovieBlog.vue') },
      {
        path: '/movie/:id',
        component: () => import('pages/MovieDetail.vue'),
        name: 'MovieDetails',
      },
    ],
  },
  {
    path: '/todo',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  },
  {
    path: '/profile',
    component: () => import('layouts/MovieLayout.vue'),
    children: [{ path: '', component: () => import('pages/ProfilePage.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes

export default [
  {
    path: '/',
    component: '@/layouts/PublicLayout',
    routes: [
      {
        path: '/',
        component: '@/pages/index',
      },
      {
        path: '/login',
        component: '@/pages/Auth/Login',
      },
      {
        path: '/register',
        component: '@/pages/Auth/Register',
      },
    ],
  },

  {
    path: '/candidate',
    component: '@/layouts/CandidateLayout',
    routes: [
      {
        path: '/candidate/dashboard',
        component: '@/pages/Candidate/Dashboard',
      },
      {
        path: '/candidate/applications',
        component: '@/pages/Candidate/Applications',
      },
      {
        path: '/candidate/applications/create',
        component: '@/pages/Candidate/CreateApplication',
      },
      {
        path: '/candidate/profile',
        component: '@/pages/Candidate/Profile',
      },
    ],
  },

  {
    path: '/admin',
    component: '@/layouts/AdminLayout',
    routes: [
      {
        path: '/admin/export-report',
        component: '@/pages/Admin/ExportReport',
      },
    ],
  },
];
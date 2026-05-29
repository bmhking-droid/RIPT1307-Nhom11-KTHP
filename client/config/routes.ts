export default [
  // Auth
  {
    path: '/login',
    component: '@/pages/Auth/Login',
  },
  {
    path: '/register',
    component: '@/pages/Auth/Register',
  },

  //Public
  {
    path: '/',
    component: '@/layouts/PublicLayout',
    routes: [
      {
        path: '/',
        component: '@/pages/index',
      },
      {
        path: '/lookup',
        component: '@/pages/Lookup',
      },
    ],
  },

//CANDIDATE
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
        path: '/candidate/applications/:id',
        component: '@/pages/Candidate/ApplicationDetail',
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
  
  //ADMIN
  {
    path: '/admin',
    component: '@/layouts/AdminLayout',
    routes: [
      {
        path: '/admin',
        redirect: '/admin/dashboard',
      },
      {
        path: '/admin/dashboard',
        component: '@/pages/Admin/Dashboard',
      },
      {
        path: '/admin/universities',
        component: '@/pages/Admin/Universities',
      },
      {
        path: '/admin/majors',
        component: '@/pages/Admin/Majors',
      },
      {
        path: '/admin/subject-groups',
        component: '@/pages/Admin/SubjectGroups',
      },
      {
        path: '/admin/admission-rounds',
        component: '@/pages/Admin/AdmissionRounds',
      },
      {
        path: '/admin/applications',
        component: '@/pages/Admin/Applications',
      },
      {
        path: '/admin/applications/:id',
        component: '@/pages/Admin/ApplicationDetail',
      },
      {
        path: '/admin/users',
        component: '@/pages/Admin/Users',
      },
      {
        path: '/admin/settings',
        component: '@/pages/Admin/Settings',
      },
    ],
  }
];
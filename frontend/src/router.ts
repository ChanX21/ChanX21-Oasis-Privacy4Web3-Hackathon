import { createRouter, createWebHashHistory } from 'vue-router';

import HomeView from './views/HomeView.vue';
import PatientPage from './components/PatientPage.vue';
import DoctorPage from './components/DoctorPage.vue';
import HealthCenterPage from './components/HealthCenterPage.vue';

const router = createRouter({
  strict: true,
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: HomeView,
    },
    {
      path: '/patient',
      component: PatientPage,
    },
    {
      path: '/doctor',
      component: DoctorPage,
    },
    {
      path: '/health-center',
      component: HealthCenterPage,
    },
    {
      path: '/:path(.*)',
      component: () => import('./views/404View.vue'),
    },
  ],
});

export default router;

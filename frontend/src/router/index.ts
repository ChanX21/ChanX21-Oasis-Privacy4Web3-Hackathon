import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '@/components/LandingPage.vue'
import PatientPage from '@/components/PatientPage.vue'
import DoctorPage from '@/components/DoctorPage.vue'
import HealthCenterPage from '@/components/HealthCenterPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LandingPage
    },
    {
      path: '/patient',
      name: 'patient',
      component: PatientPage
    },
    {
      path: '/doctor',
      name: 'doctor',
      component: DoctorPage
    },
    {
      path: '/health-center',
      name: 'healthCenter',
      component: HealthCenterPage
    }
  ]
})

export default router
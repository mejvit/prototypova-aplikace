import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue'
import Camera from '../views/Camera.vue'
import GeoLocation from '../views/GeoLocation.vue'
import Haptics from '../views/Haptics.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/camera',
    name: 'Camera',
    component: Camera
  },
  {
    path: '/geolocation',
    name: 'GeoLocation',
    component: GeoLocation
  },
  {
    path: '/haptics',
    name: 'Haptics',
    component: Haptics
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

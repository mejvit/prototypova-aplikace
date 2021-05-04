import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';
import Camera from '../views/Camera.vue';
import Device from '../views/Device.vue';
import GeoLocation from '../views/GeoLocation.vue';
import Haptics from '../views/Haptics.vue';
import Soundrecord from '../views/Soundrecord.vue';
import Network from '../views/Network.vue';
import FilesystemIndex from '../views/Filesystem/Index.vue';
import FilesystemEdit from '../views/Filesystem/Edit.vue';
import FilesystemCreate from '../views/Filesystem/Create.vue';
import Containers from '../views/Containers.vue';
import SQLiteIndex from '../views/SQLite/Index.vue';
import SQLiteCreate from '../views/SQLite/Create.vue';
import SQLiteShow from '../views/SQLite/Show.vue';
import SQLiteEdit from '../views/SQLite/Edit.vue';

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
  {
    path: '/device',
    name: 'Device',
    component: Device
  },
  {
    path: '/soundrecord',
    name: 'Soundrecord',
    component: Soundrecord
  },
  {
    path: '/sqlite',
    name: 'SQLite',
    component: SQLiteIndex
  },
  {
    path: '/sqlite/create',
    name: 'SQLiteCreate',
    component: SQLiteCreate
  },
  {
    path: '/sqlite/:id/show',
    name: 'ShowItem',
    component: SQLiteShow
  },
  {
    path: '/sqlite/:id/edit',
    name: 'EditItem',
    component: SQLiteEdit
  },

  {
    path: '/filesystem',
    name: 'FilesystemIndex',
    component: FilesystemIndex
  },

  {
    path: '/filesystem/create',
    name: 'FilesystemCreate',
    component: FilesystemCreate
  },

  {
    path: '/filesystem/:filename',
    name: 'FilesystemEdit',
    component: FilesystemEdit,
    props: true
  },
  {
    path: '/network',
    name: 'Network',
    component: Network
  },

  {
    path: '/containers',
    name: 'Containers',
    component: Containers
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

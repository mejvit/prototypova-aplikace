<template>
  <ion-app>
  <ion-menu contentId="content" menuId="main-menu">
    <ion-list-header>Nativní funkce</ion-list-header>
    <ion-content>
      <ion-list>
        <ion-menu-toggle>
          <ion-item router-link="/home" :class="{ selected: route.path === '/home' }">
            <ion-icon slot="start" :icon="trailSignOutline" />
            <ion-label>Úvodní stránka</ion-label>
          </ion-item>
        </ion-menu-toggle>
        <ion-menu-toggle v-for="(item, i) in appFunctions" :key="i">
          <ion-item :router-link="item.route" :class="{ selected: route.path === item.route }">
            <ion-icon slot="start" :icon="item.icon" />
            <ion-label>{{ item.name }}</ion-label>
          </ion-item>
        </ion-menu-toggle>
      </ion-list>
    </ion-content>
  </ion-menu>
  <ion-router-outlet id="content"></ion-router-outlet>
  </ion-app>
</template>

<script lang="ts">
import {
  IonApp, IonContent, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonMenu, IonMenuToggle,
  IonRouterOutlet, menuController
} from '@ionic/vue';
import { 
  camera, compassOutline, fingerPrintOutline, folder, globeOutline, informationCircleOutline, micOutline, server, trailSignOutline 
} from 'ionicons/icons';
import { defineComponent, getCurrentInstance, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonContent,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonMenu,
    IonMenuToggle,
    IonRouterOutlet
  },

  data() {
    return {
      appFunctions: [
        {
          name: "Fotoaparát",
          route: "/camera",
          icon: camera
        },
        {
          name: "Poloha zařízení",
          route: "/geolocation",
          icon: compassOutline
        },
        {
          name: "Souborový systém",
          route: "/filesystem",
          icon: folder
        },
        {
          name: "Připojení k síti",
          route: "/network",
          icon: globeOutline
        },
        {
          name: "Záznam zvuku",
          route: "/soundrecord",
          icon: micOutline
        },
        {
          name: "Úložiště SQLite",
          route: "/sqlite",
          icon: server
        },
        {
          name: "Haptické funkce",
          route: "/haptics",
          icon: fingerPrintOutline
        },
        {
          name: "Informace o zařízení",
          route: "/device",
          icon: informationCircleOutline
        }
      ]
    }
  },
  mounted() {
    menuController.open('main-menu');
  },
  
  provide() {
    return {
      appLinks: this.appFunctions
    }
  },

  setup() {
    const route = useRoute();
    const app = getCurrentInstance();

    onUnmounted (async () => {
      const db = app?.appContext.config.globalProperties.$database;
      await db.close();
    });
    return {
      camera, compassOutline, fingerPrintOutline, folder, globeOutline, informationCircleOutline, micOutline, server, trailSignOutline,
      route
    }
  }
});
</script>

<style scoped>
ion-menu.md ion-item.selected {
  --background: rgba(var(--ion-color-primary-rgb), 0.14);
}

ion-menu.md ion-item.selected ion-icon {
  color: var(--ion-color-primary);
}

</style>
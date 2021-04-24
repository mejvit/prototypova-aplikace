<template>
  <ion-app>
  <ion-menu content-id="content" menu-id="another-menu">
    <ion-list-header>Nativní funkce</ion-list-header>
    <ion-content>
      <ion-list>
        <ion-menu-toggle v-for="(item, i) in appFunctions" :key="i">
          <ion-item :router-link="item.route" :class="{ selected: route.path === item.route }">
            <ion-icon slot="start" :icon="item.icon" />
            <ion-label>{{ item.name }}</ion-label>
          </ion-item>
        </ion-menu-toggle>
      </ion-list>
    </ion-content>
  </ion-menu>
  <ion-router-outlet id="content" />
  </ion-app>
</template>

<script lang="ts">
import {
  IonApp, IonContent, IonItem, IonLabel, IonList, IonListHeader, IonMenu, IonMenuToggle,
  IonRouterOutlet, menuController
} from '@ionic/vue';
import { 
  camera, compassOutline, fingerPrintOutline, folder, globeOutline, informationCircleOutline, micOutline, server 
} from 'ionicons/icons';
import { defineComponent } from 'vue';
import { useRoute } from 'vue-router';


export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonContent,
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
  
  setup() {
    const route = useRoute();
    return {
      camera, compassOutline, fingerPrintOutline, folder, globeOutline, informationCircleOutline, micOutline, server,
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
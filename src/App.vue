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
  IonApp, IonContent, IonItem, IonList, IonListHeader, IonMenu, IonMenuToggle,
  IonRouterOutlet, menuController
} from '@ionic/vue';
import { camera, folder, micOutline, server } from 'ionicons/icons';
import { defineComponent } from 'vue';
import { useRoute } from 'vue-router';


export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonContent,
    IonItem,
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
          name: "Kamera",
          route: "/camera",
          icon: camera
        },
        {
          name: "Souborový systém",
          route: "/filesystem",
          icon: folder
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
      camera, folder, micOutline, server, route
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
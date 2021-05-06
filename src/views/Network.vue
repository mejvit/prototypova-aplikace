<template>
<page-container title="Připojení k síti">
  <ion-list v-if="statusLoaded">
    <ion-list-header>
      <ion-label>Stav připojení</ion-label>
    </ion-list-header>
    <ion-item>
      <ion-label>
        <h3>Připojeno:</h3>
        <p>{{networkStatus.connected ? "Ano" : "Ne"}}</p>
      </ion-label>
    </ion-item>
    <ion-item>
      <ion-label>
        <h3>Typ připojení:</h3>
        <p>{{networkStatus.connectionType}}</p>
      </ion-label>
    </ion-item>
  </ion-list>
</page-container>
</template>

<script lang="ts">
import { 
  IonItem, IonLabel, IonList, IonListHeader,
  loadingController
} from '@ionic/vue';
import { defineComponent, onMounted, ref } from 'vue';
import { Plugins, NetworkStatus } from "@capacitor/core";
import PageContainer from "@/components/PageContainer.vue";

const { Network, Toast } = Plugins;

export default defineComponent({
  name: "Network",
  components: {
    IonItem, IonLabel, IonList, IonListHeader,
    PageContainer
  },
  setup() {
    const statusLoaded = ref<boolean>(false);
    const networkStatus = ref<NetworkStatus>();
    
    Network.addListener('networkStatusChange', async (status) => {
      const msg = (status.connected) ? "Připojeno k síti ("+status.connectionType+")" : "Offline";
      networkStatus.value = status;
      await Toast.show({
        text: msg
      });
    });

    onMounted(async () => {
      const loading = await loadingController
        .create({
          message: 'Načítám data...',
        });
      await loading.present();

      networkStatus.value = await Network.getStatus();
      statusLoaded.value = true;
      loading.dismiss();
    });
    return {
      statusLoaded,
      networkStatus
    }
  },
})
</script>
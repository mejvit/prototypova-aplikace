<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/sqlite"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ record.name }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content v-if="hybridPlatform">
      <ion-list>
        <ion-item>
          <ion-label position="stacked">Název</ion-label>          
          <p>{{ record.name }}</p>
        </ion-item>
        <ion-item>
          <ion-label position="stacked">Číslo</ion-label>          
          <p>{{ record.number }}</p>
        </ion-item>
        <ion-item>
          <ion-label position="stacked">Datum</ion-label>          
          <p>{{ record.date }}</p>
        </ion-item>
        <ion-item>
          <ion-label position="stacked">Popis záznamu</ion-label>          
          <p>{{ record.description }}</p>
        </ion-item>
      </ion-list>
    </ion-content>
    <ion-content v-else>
      <div class="no-sqlite">
        <p>Na této platformě není podporována SQLite databáze</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">

import { 
  IonBackButton, IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonList, IonPage, 
  IonTitle, IonToolbar,
  isPlatform,
  onIonViewWillEnter
} from "@ionic/vue";
import { defineComponent, getCurrentInstance, onMounted, ref } from 'vue';
import { addOutline } from 'ionicons/icons';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { DbRecord } from '../../composables/useSQLiteInApp';
import { useRouter, useRoute } from 'vue-router';

export default defineComponent({
  name: 'SQLiteShow',
  components: {
    IonBackButton, IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonList, IonPage,
    IonTitle, IonToolbar,
  },
  setup() {
    const hybridPlatform = ref<boolean>(isPlatform("hybrid"));
    const app = getCurrentInstance();
    const db: SQLiteDBConnection = app?.appContext.config.globalProperties.$database;

    const router = useRouter();
    const route = useRoute();
    const record = ref<DbRecord>({name: "", number: 0, date: "", description: ""});
    let result: any;

    const prepareRecord = async function () {
      const intId = parseInt(route.params.id[0]);
      result = await db.query("SELECT * FROM records WHERE id = "+ intId +";");

      const val = result.values[0];
      record.value.name = val.name;
      record.value.number = val.number;
      record.value.date = val.date;
      record.value.description = val.description;
    }

    onMounted(async () => {
      await prepareRecord();
    });

    onIonViewWillEnter(async () => {
      await prepareRecord();      
    });

    return {
      addOutline, hybridPlatform,
      record,
      route,
      router
    }
  },
})
</script>

<style scoped>
.no-sqlite {
  width: 100%;
  height: 80vh;
  display: flex;
}
.no-sqlite p {
  width: 100%;
  align-self: center;
  text-align: center;
}
</style>
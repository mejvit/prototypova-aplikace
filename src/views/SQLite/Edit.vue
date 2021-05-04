<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/sqlite"></ion-back-button>
        </ion-buttons>
        <ion-title>Upravit záznam {{route.params.id}}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content v-if="hybridPlatform">
      <ion-list>
        <ion-item>
          <ion-label position="stacked">Název záznamu</ion-label>
          <ion-input placeholder="Název" required="true" v-model="record.name"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="stacked">Číslo</ion-label>
          <ion-input type="number" placeholder="Číslo" inputmode="numeric" v-model="record.number"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="stacked">Datum</ion-label>
          <ion-input type="date" placeholder="Datum" v-model="record.date"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="stacked">Popis záznamu</ion-label>
          <ion-textarea placeholder="Podrobný popis záznamu" rows="6" v-model="record.description"></ion-textarea>
        </ion-item>
      </ion-list>
      <ion-button expand="block" @click="updateRecord()">
        <ion-icon slot="start" :icon="addOutline"></ion-icon>
        Uložit záznam
      </ion-button>
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
  IonBackButton, IonButton, IonButtons, IonContent,
  IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonPage, IonTextarea, IonTitle, IonToolbar,
  isPlatform,
  onIonViewWillEnter
} from "@ionic/vue";
import { defineComponent, getCurrentInstance, onMounted, ref } from 'vue';
import { addOutline } from 'ionicons/icons';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { DbRecord } from '../../composables/useSQLiteInApp';
import { useRouter, useRoute } from 'vue-router';

export default defineComponent({
  name: 'SQLiteEdit',
  components: {
    IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonPage, IonTextarea, IonTitle, IonToolbar,
  },
  setup() {
    const hybridPlatform = ref<boolean>(isPlatform("hybrid"));
    const app = getCurrentInstance();
    const db: SQLiteDBConnection = app?.appContext.config.globalProperties.$database;

    const router = useRouter();
    const route = useRoute();
    const record = ref<DbRecord>({name: "", number: 0, date: "", description: ""});
    let result: any;

    const updateRecord = async function () {
      if (db != null) {
        const sqlcmd =  "UPDATE records SET name=?,number=?,date=?,description=? WHERE id=?";
        const intId = parseInt(route.params.id[0]);
        const values: Array<any>  = [record.value.name, record.value?.number, record.value?.date, record.value?.description, intId];
        result = await db.run(sqlcmd,values);
        console.log(result);
        router.back();
      }
    }

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
      addOutline,
      record,hybridPlatform,
      route,
      router,
      updateRecord
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
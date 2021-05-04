<template>
  <ion-page>
    <page-header>Databáze SQLite</page-header>
    <ion-content v-if="hybridPlatform">
      <ion-list>
        <ion-list-header>Uložené záznamy</ion-list-header>
        <ion-item v-for="record in records" :key="record.id">
          <span @click="router.push('/sqlite/'+record.id+'/show')" slot="end">
            <ion-icon :icon="eyeOutline"></ion-icon>
          </span>
          <span @click="router.push('/sqlite/'+record.id+'/edit')" slot="end">
            <ion-icon :icon="pencilOutline"></ion-icon>
          </span>
          <span @click="showDeleteDialog(record.id)" slot="end">
            <ion-icon :icon="trashOutline"></ion-icon>
          </span>
          <ion-label>
            <h2>{{ record.name }}</h2>
            <p>{{ record.number }}</p>
          </ion-label>
        </ion-item>
      </ion-list>
      <ion-fab vertical="bottom" horizontal="center" slot="fixed">
        <ion-fab-button router-link="/sqlite/create">
          <ion-icon :icon="addOutline"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
    <ion-content v-else>
      <div class="no-sqlite">
        <p>Na této platformě není podporována SQLite databáze</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import PageHeader from "@/components/PageHeader.vue";
import { 
  IonContent, IonFab, IonFabButton, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonPage,
  alertController,
  isPlatform,
  onIonViewWillEnter
} from "@ionic/vue";
import { defineComponent, getCurrentInstance, onMounted, ref } from 'vue';
import { addOutline, eyeOutline, pencilOutline, trashOutline } from 'ionicons/icons';
import { capSQLiteSet, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { DbRecord } from '../../composables/useSQLiteInApp';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: "SQLiteIndex",
  components: {
    IonContent, IonFab, IonFabButton, IonIcon, IonItem, IonLabel, IonList, IonListHeader,
    IonPage,
    PageHeader,
  },
  setup() {
    const hybridPlatform = ref<boolean>(isPlatform("hybrid"));
    const router = useRouter();
    const records = ref<DbRecord[]>([]);
    let result: any;
    
    const app = getCurrentInstance();
    const db: SQLiteDBConnection = app?.appContext.config.globalProperties.$database;

    const deleteRecord = async function (id: number) {
      const sqlcmd = "DELETE FROM records WHERE id = ?";
      result = await db.run(sqlcmd, [id]);
      records.value = records.value.filter((r)=> r.id !== id);
    }

    const showDeleteDialog = async function(id: number) {
      const alert = await alertController
        .create({
          cssClass: 'my-custom-class',
          header: 'Odstranit záznam?',
          message: 'Přejete si odstranit záznam?',
          buttons: [
            {
              text: 'Zrušit',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {return},
            },
            {
              text: 'Odstranit',
              handler: async () => {
                deleteRecord(id)
              },
            },
          ],
        });
      return alert.present();
    }

    onMounted(async () => {
      result = await db.query("SELECT id, name, number FROM records;");
      records.value = result.values;
    });

    onIonViewWillEnter(async () => {
      result = await db.query("SELECT id, name, number FROM records;");
      records.value = result.values;
    });

    return {
      addOutline, showDeleteDialog, eyeOutline, pencilOutline, records,
      router, trashOutline, hybridPlatform
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
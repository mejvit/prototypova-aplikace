<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/home"></ion-back-button>
        </ion-buttons>
        <ion-title>Testy nativních funkcí</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content fullscreen="true" class="ion-padding">
      <ion-header collapse="condense">
        <!--Následující kód se projeví pouze na iOS-->
        <ion-toolbar>
        <ion-title>Testy nativních funkcí</ion-title>
        </ion-toolbar>
      </ion-header>
      <ul>
        <li v-for="(val, name, i) in r" :key="i">{{name}}: {{val}}</li>
      </ul>
      <ion-button @click="runTests">Spustit testy</ion-button>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, reactive } from 'vue'
import {
  IonContent,
  IonTitle,
  IonButtons, IonButton,
  IonPage,
  IonHeader,
  IonToolbar,
  IonBackButton
} from "@ionic/vue";

import { Plugins, FilesystemDirectory, FilesystemEncoding } from "@capacitor/core";

const { Device, Filesystem, Geolocation, Network } = Plugins;
export default defineComponent({
  name: 'TestsNative',
  components: {
    IonHeader, IonToolbar, IonPage, IonContent, IonButtons, IonButton, IonBackButton, IonTitle
  },
  setup() {
    const app = getCurrentInstance();
    const db = app?.appContext.config.globalProperties.$database;

    const r = reactive({
      devGetInfo: "",
      devGetBatteryInfo: "",
      devGetLanguageCode: "",
      geoGetCurrentPosition: "",
      netGetStatus: "",
      dbInsert: "",
      dbDelete: "",
      fileCreate: "",
      fileDelete: "",
    });
    const runTests = async () => {
      let start;
      let end;
      start = new Date().getTime();
      await Device.getInfo();
      end = new Date().getTime();
      r.devGetInfo = (end - start).toString();

      start = new Date().getTime();
      await Device.getBatteryInfo();
      end = new Date().getTime();
      r.devGetBatteryInfo = (end - start).toString();

      start = new Date().getTime();
      await Device.getLanguageCode();
      end = new Date().getTime();
      r.devGetLanguageCode = (end - start).toString();

      start = new Date().getTime();
      await Geolocation.getCurrentPosition();
      end = new Date().getTime();
      r.geoGetCurrentPosition = (end - start).toString();
      
      start = new Date().getTime();
      await Network.getStatus();
      end = new Date().getTime();
      r.netGetStatus = (end - start).toString();

      start = new Date().getTime();
      const result = await db.run("INSERT INTO records (name,number,date,description) VALUES (?,?,?,?)", ["text", 1000, "2021-01-01", "test description"]);
      end = new Date().getTime();
      r.dbInsert = (end - start).toString();
      const id = result.changes.lastId;

      start = new Date().getTime();
      await db.run("DELETE FROM records WHERE id = ?", [id]);
      end = new Date().getTime();
      r.dbDelete = (end - start).toString();

      start = new Date().getTime();
      await Filesystem.writeFile({
          path: 'prototypova_aplikace/testfile001.txt',
          data: 'test data',
          directory: FilesystemDirectory.Documents,
          encoding: FilesystemEncoding.UTF8,
          recursive: true
        });
      end = new Date().getTime();
      r.fileCreate = (end - start).toString();


      start = new Date().getTime();
      await Filesystem.deleteFile({
        path: 'prototypova_aplikace/testfile001.txt',
        directory: FilesystemDirectory.Documents
      });
      end = new Date().getTime();
      r.fileDelete = (end - start).toString();

    }

    return {
      r,  
      runTests
    }
  },
})
</script>

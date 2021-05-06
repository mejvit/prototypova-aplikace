<template>
  <page-container title="Nahrávání zvuku">
    <ion-list v-if="recordsLoaded">
      <ion-item-sliding 
      v-for="(path, i) in recordPaths" :key="i"
      :disabled="recordPlayingPath === path && recordPlayingPath != ''"
      >
        <ion-item :disabled="recordPlayingPath !== path && recordPlayingPath != ''">
          <span slot="start">
            <div v-on="recordPlayingPath === path ? {click: () => stopRecord() } : { click: () => playRecord(path) }">
              <ion-icon :icon="recordPlayingPath === path ? stopOutline : playOutline" class="record"></ion-icon>
            </div>
          </span>       
          <ion-label>{{ path.substring(path.lastIndexOf('/')+1) }}</ion-label>
        </ion-item>
        <ion-item-options>
          <ion-item-option color="danger" @click="deleteRecord(path)">
            <ion-icon slot="start" :icon="trash"></ion-icon>
          </ion-item-option>
        </ion-item-options>
      </ion-item-sliding>
    </ion-list>
    <ion-fab vertical="bottom" horizontal="center" slot="fixed">
      <ion-fab-button v-on="isRecording ? {click: () => stopRecording() } : { click: () => startRecording() }">
        <ion-icon :icon="isRecording ? stopOutline : micOutline"></ion-icon>
      </ion-fab-button>
    </ion-fab>
  </page-container>
</template>

<script lang="ts">
import { micOutline, playOutline, stopOutline, trash } from 'ionicons/icons';
import {
  IonFab, IonFabButton,
  IonIcon, IonItem, IonItemOption, IonItemOptions, IonItemSliding,
  IonLabel, IonList,
  isPlatform, loadingController
} from '@ionic/vue';
import { Media, MediaObject} from '@ionic-native/media';
import { File } from '@ionic-native/file';
import { defineComponent, onMounted, ref, watch } from 'vue'
import { Plugins } from '@capacitor/core';
import PageContainer from '@/components/PageContainer.vue';

export default defineComponent({
  components: {
    IonFab, IonFabButton,
    IonIcon, IonItem, IonItemOption, IonItemOptions, IonItemSliding,
    IonLabel, IonList,
    PageContainer
  },
  setup() {
    const { Storage } = Plugins;
    const isRecording = ref<boolean>(false);
    const media = Media;
    const file = File;
    let filePath: string;
    const recordPaths = ref<string[]>([]);
    const recordsLoaded = ref<boolean>(false);
    let recordFile: MediaObject;
    const recordPlayingPath = ref<string>("");
    /**
     * Prepares file path for new record
     */
    const getFilePath = (): string => {
      const fileName = 'record'+new Date().getDate()+new Date().getMonth()+new Date().getFullYear()+new Date().getHours()+new Date().getMinutes()+new Date().getSeconds()+'.mp3';

      if (isPlatform("android")) {
        console.log(file.externalDataDirectory + fileName);
        return file.externalDataDirectory.replace(/^file:\/\//, '') + fileName;
      }

      return file.dataDirectory.replace(/^file:\/\//, '') + fileName;
    }

    /**
     * Initializes new file (object) for recording
     */
    const setNewFile = async () => {
      filePath = getFilePath();


      if (isPlatform("ios")) {
        const filePathOnly = filePath.substring(0,filePath.lastIndexOf('/'));
        const fileName = filePath.substring(filePath.lastIndexOf('/')+1);
        await file.createFile(filePathOnly, fileName, true);
      }
      recordFile = media.create(filePath);
    }

    const startRecording = async () => {
      isRecording.value = true;
      await setNewFile();
      recordFile.startRecord();      
    }

    const stopRecording = () => {
      recordFile.stopRecord();
      recordFile.release();
      recordPaths.value = [filePath, ...recordPaths.value];
      isRecording.value =  false;
    }

    const myObserver = {
      next(data: any) {
        if (data == 4) {
          recordFile.release();
          recordPlayingPath.value = "";
        }
        console.log(data)
      },
      error(e: any) {
        console.log(e)
      },
      complete() {
        console.log("request complete")
      }
    }

    const playRecord = (path: string) => {
      recordPlayingPath.value = path;
      recordFile = media.create(path);
      recordFile.play();
      recordFile.onStatusUpdate.subscribe(myObserver);
    }

    const stopRecord = () => {
      recordFile.stop();
      recordFile.release();
      recordPlayingPath.value = "";
    }
    
    const cacheRecords = () => {
      Storage.set({
        key: 'recordPaths',
        value: JSON.stringify(recordPaths.value)
      });
    }
    
    const loadRecords = async () => {
      
      const result = await Storage.get({key: 'recordPaths'});
      console.log(result);
      if (result.value !== null) {
        recordPaths.value = JSON.parse(result.value);
        console.log(recordPaths.value);
        recordsLoaded.value = true;
      }
    }

    const deleteRecord = (path: string) => {
      // const filePathOnly = path.substring(0,path.lastIndexOf('/'));
      // const fileName = path.substring(path.lastIndexOf('/')+1);
      // await file.removeFile(filePathOnly, fileName);
      recordPaths.value = recordPaths.value.filter((rec) => rec !== path);
    }

    watch(recordPaths, cacheRecords);
    onMounted(async () => {
      const loading = await loadingController
        .create({
          message: 'Načítám nahrávky...',
        });
      await loading.present();
      await loadRecords();      
      loading.dismiss();
    });
    
    return {
      isRecording,
      playRecord,
      recordPaths, recordPlayingPath,
      recordsLoaded,
      startRecording, stopRecording, stopRecord,
      deleteRecord,
      micOutline, playOutline, stopOutline, trash
    }
  },
})
</script>

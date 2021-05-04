<template>
  <ion-page>
    <page-header>Záznam zvuku</page-header>
    <ion-content :fullscreen="true">
      <ion-list>
        <ion-item
          v-on="record.isPlaying ? { click: () => stopRecord(record) } : { click: () => playRecord(record) }"
          v-for="record in records" 
          :key="record.filePath"
          :disabled="isRecording"
        >
          <ion-icon :icon="record.isPlaying ? stopOutline : playOutline" class="ion-margin"></ion-icon>
          <p class="ion-margin">{{ record.fileName }}</p>
        </ion-item>
      </ion-list>
      <ion-fab vertical="bottom" horizontal="center" slot="fixed">
        <ion-fab-button @click="stopRecording" v-if="isRecording">
          <ion-icon :icon="stopOutline"></ion-icon>
        </ion-fab-button>
        <ion-fab-button @click="startRecording" v-else>
          <ion-icon :icon="micOutline"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue'
import { 
  IonContent, IonFab, IonFabButton, IonIcon, IonItem, IonLabel, IonList, IonPage, isPlatform,
} from '@ionic/vue';
import { Plugins } from '@capacitor/core'
import PageHeader from '../components/PageHeader.vue'
import { Media, MediaObject} from '@ionic-native/media'
import { File } from '@ionic-native/file'
import { micOutline, playOutline, stopOutline } from 'ionicons/icons';

export default defineComponent({
  name: "Soundrecord",
  components: {
    IonContent, IonFab, IonFabButton, IonIcon, IonItem, /*IonLabel,*/ IonList, IonPage,
    PageHeader
  },
  setup() {
    interface SoundRecord {
      isPlaying: boolean;
      fileName?: string;
      filePath: string;
      mediaObject?: MediaObject;
    }

    const { Storage } = Plugins;
    const isRecording = ref<boolean>(false);
    const fileBeingRecorded = ref<SoundRecord>();
    const records = ref<SoundRecord[]>([]);

    const getFileName = (filePath: string) => {
      return filePath.replace(/^.*[\\/]/, '')
    };

    const startRecording = function() {
      isRecording.value = true;
      const fileName = 'record'+new Date().getDate()+new Date().getMonth()+new Date().getFullYear()+new Date().getHours()+new Date().getMinutes()+new Date().getSeconds()+'.mp3';
      
      
      let filePath = File.externalDataDirectory.replace(/file:\/\//g, '') + fileName;
      if (isPlatform("ios")) {        
        filePath = File.dataDirectory.replace(/file:\/\//g, '') + fileName;
      }
      fileBeingRecorded.value = {
        isPlaying: false,
        fileName: getFileName(filePath),
        filePath: filePath,
        mediaObject: Media.create(filePath)
      };
    }

    const stopRecording = function() {
      fileBeingRecorded.value?.mediaObject?.stopRecord();
      fileBeingRecorded.value?.mediaObject?.release();
      if(typeof fileBeingRecorded.value !== "undefined")
      {
        records.value = [fileBeingRecorded.value, ...records.value];
      }
      isRecording.value = false;
    }

    const cacheRecords = () => {
      const pathsToRecords = records.value.map((rec) => {
        return rec.filePath;
      });
      Storage.set({
        key: 'soundrecords',
        value: JSON.stringify(pathsToRecords)
      });
    };

    const loadRecords = async () => {
        const pathsToRecords = await Storage.get({key: 'soundrecords'});
        const pathsToRecordsArray = pathsToRecords.value ? JSON.parse(pathsToRecords.value) : [];
        for (const path of pathsToRecordsArray) {
          records.value.push({
            isPlaying: false,
            fileName: getFileName(path),
            filePath: path
          })
        }
    };

    watch(records, cacheRecords);
    onMounted(async () => {
      await loadRecords();
      console.log(records.value);
    });
  
    /* Playing records */

    const playRecord = (record: SoundRecord) => {
      console.log(fileBeingRecorded.value?.mediaObject);
      fileBeingRecorded.value?.mediaObject?.play();
      record.mediaObject = Media.create(record.filePath);
      record.mediaObject.play();
      record.isPlaying = true;
    }

    const stopRecord = (record: SoundRecord) => {
      console.log(record);
      record.mediaObject?.stop();
      record.mediaObject?.release();
      record.isPlaying = false;
    }

    
    return {
      micOutline, playOutline, stopOutline,
      isRecording,
      playRecord,
      startRecording,
      stopRecording,
      stopRecord,
      records
    }
  },
})
</script>



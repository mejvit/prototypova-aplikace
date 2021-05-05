<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/filesystem"></ion-back-button>
        </ion-buttons>
        <ion-title>Upravit {{ filename }}.txt</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-item>
        <ion-label position="floating">Obsah souboru</ion-label>
        <ion-textarea placeholder="Obsah textového souboru" rows="5" v-model="newFileContent"></ion-textarea>
      </ion-item>
      <ion-button @click="saveFile" expand="block">Uložit změny</ion-button>
    </ion-content>
  </ion-page>    
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { Plugins, FileReadResult, FilesystemDirectory, FilesystemEncoding } from '@capacitor/core';
import {
  IonBackButton, IonButton, IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonPage,
  IonTextarea, IonTitle, IonToolbar
} from '@ionic/vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: "FilesystemEdit",
  components: {
    IonBackButton, IonButton, IonButtons,
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonPage,
    IonTextarea, IonTitle, IonToolbar
  },
  props: ['filename'],
  setup(props) {
    const router = useRouter();
    const { Filesystem } = Plugins;
    const fileContent = ref<FileReadResult>();
    const newFileContent = ref<string>("");

    const saveFile = async function() {
      try {
        const result = await Filesystem.writeFile({
          path: 'prototypova_aplikace/'+ props.filename +'.txt',
          data: newFileContent.value ? newFileContent.value : "",
          directory: FilesystemDirectory.Documents,
          encoding: FilesystemEncoding.UTF8
        });
        console.log('Wrote file', result);
        router.back();
      }
      catch(e) {
        console.error('Unable to write file', e);
      }
    }

    onMounted(async () => {
      fileContent.value = await Filesystem.readFile({
        path: 'prototypova_aplikace/'+ props.filename +'.txt',
        directory: FilesystemDirectory.Documents,
        encoding: FilesystemEncoding.UTF8
      });
      newFileContent.value = fileContent.value.data;
      console.log(newFileContent.value);

    });
    return {
      newFileContent,
      saveFile
    }
  },
})
</script>

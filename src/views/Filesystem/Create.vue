<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/filesystem"></ion-back-button>
        </ion-buttons>
        <ion-title>Vytvořit soubor</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-item>
        <ion-label position="floating">Název souboru</ion-label>
        <ion-input type="text" pattern="^[0-9a-zA-Z_\-. ]+$" placeholder="Zadejte název souboru" v-model="fileName"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="floating">Obsah souboru</ion-label>
        <ion-textarea placeholder="Obsah textového souboru" rows="5" v-model="fileContent"></ion-textarea>
      </ion-item>
      <span class="ion-padding"><ion-text color="danger" v-if="isError">{{ errorMsg }}</ion-text></span>
      <ion-button @click="createFile" expand="block">Vytvořit soubor</ion-button>
      <p class="filesystem-info">* soubory se ukládají do v adresáři dokumenty do složky prototypova_aplikace</p>
    </ion-content>
  </ion-page>    
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { Plugins, FilesystemDirectory, FilesystemEncoding } from '@capacitor/core';
import {
  IonBackButton, IonButton, IonButtons,
  IonContent,
  IonHeader,
  IonInput, IonItem,
  IonLabel,
  IonPage,
  IonText, IonTextarea, IonTitle, IonToolbar
} from '@ionic/vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: "FilesystemCreate",
  components: {
    IonBackButton, IonButton, IonButtons,
    IonContent,
    IonHeader,
    IonInput, IonItem,
    IonLabel,
    IonPage,
    IonText, IonTextarea, IonTitle, IonToolbar
  },
  setup() {
    const router = useRouter();
    const { Filesystem } = Plugins;
    const fileName = ref<string>("");
    const fileContent = ref<string>("");
    const errorMsg = ref<string>("");
    const isError = ref<boolean>(false);

    const createFile = async function () {
      try {
        isError.value = false;
        if (fileName.value.length < 3) {
          errorMsg.value = "Název musí mít aspoň 3 znaky.";
          isError.value = true;
          return;
        }
        if (!fileName.value.match(/^[0-9a-zA-Z_\-. ]+$/)) {
          errorMsg.value = "Neplatný název souboru.";
          isError.value = true;
          return;
        }

        const result = await Filesystem.writeFile({
          path: 'prototypova_aplikace/' + fileName.value + '.txt',
          data: fileContent.value,
          directory: FilesystemDirectory.Documents,
          encoding: FilesystemEncoding.UTF8
        });
        console.log('Wrote file', result);
        router.back();
      } catch(e) {
        errorMsg.value = "Chyba při vytváření souboru.";
        isError.value = true;
        console.error('Unable to write file', e);
      }
    }

    return {
      createFile,
      isError,
      errorMsg,
      fileName,
      fileContent
    }
  },
})
</script>

<style scoped>
  .filesystem-info {
    padding: 0.4em 1em;
    font-size: 0.8em;
    color: #949494;
  }
</style>
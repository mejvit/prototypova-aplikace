<template>
  <ion-page>
    <page-header>Rozložení aplikace</page-header>
    <ion-content fullscreen="true" color="secondary">
      <ion-button @click="startRecording">record</ion-button>
      <ion-button @click="stopRecording">stop</ion-button>

      <ion-button @click="playRecord">play</ion-button>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import PageHeader from "@/components/PageHeader.vue";
import { IonContent, IonButton, IonPage } from "@ionic/vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "Containers",
  components: {
    IonButton, IonContent,
    IonPage,
    PageHeader,
  },
  setup() {

    return {
      
    }
  }
});
</script>

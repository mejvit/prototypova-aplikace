<template>
  <ion-page>
    <page-header>Haptické funkce</page-header>
    <ion-content :fullscreen="true">
      <ion-button expand="block" @click="notification(HapticsNotificationType.SUCCESS)">Notifikace</ion-button>
      <ion-button expand="block" @click="selectionStart">SelectionStart</ion-button>
      <ion-button expand="block" @click="vibrate">Vibrace</ion-button>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import PageHeader from "@/components/PageHeader.vue";
import { IonButton, IonContent, IonPage } from "@ionic/vue";
import { defineComponent } from "vue";
import { Plugins, HapticsNotificationOptions, HapticsNotificationType } from "@capacitor/core";

const { Haptics } = Plugins;

export default defineComponent({
  components: {
    IonButton, IonContent, IonPage,
    PageHeader,
  },
  setup() {
    const vibrate = function () {
      Haptics.vibrate();
    };

    const selectionStart = function() {
      Haptics.selectionStart();
    };

    const notification = function(options: HapticsNotificationType) {
      const opts: HapticsNotificationOptions = {type: options}
      Haptics.notification(opts);
    };

    return {
      notification,
      selectionStart,
      vibrate,
    };
  },
});
</script>
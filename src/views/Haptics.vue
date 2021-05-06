<template>
  <ion-page>
    <page-header>Haptické funkce</page-header>
    <ion-content :fullscreen="true">
      <page-header-ios>Haptické funkce</page-header-ios>
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
import PageHeaderIos from "@/components/PageHeaderIos.vue";

const { Haptics } = Plugins;

export default defineComponent({
  name: "Haptics",
  components: {
    IonButton, IonContent, IonPage,
    PageHeader,
    PageHeaderIos,
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
      HapticsNotificationType,
      notification,
      selectionStart,
      vibrate,
    };
  },
});
</script>
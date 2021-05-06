<template>
  <page-container title="Haptické funkce">
    <ion-button expand="block" @click="notification(HapticsNotificationType.SUCCESS)">Notifikace</ion-button>
    <ion-button expand="block" @click="selectionStart">SelectionStart</ion-button>
    <ion-button expand="block" @click="vibrate">Vibrace</ion-button>
  </page-container>
</template>

<script lang="ts">
import { IonButton } from "@ionic/vue";
import { defineComponent } from "vue";
import { Plugins, HapticsNotificationOptions, HapticsNotificationType } from "@capacitor/core";
import PageContainer from "@/components/PageContainer.vue";

const { Haptics } = Plugins;

export default defineComponent({
  name: "Haptics",
  components: {
    IonButton,
    PageContainer
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
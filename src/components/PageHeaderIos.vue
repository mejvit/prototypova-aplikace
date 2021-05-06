<template>
  <ion-header collapse="condense">
    <ion-toolbar>
      <ion-title size="large">
        <slot></slot>
      </ion-title>
    </ion-toolbar>
  </ion-header>
</template>

<script lang="ts">
import {
  IonHeader,
  IonTitle,
  IonToolbar,
} from "@ionic/vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "page-header-ios",
  components: {
    IonHeader,
    IonTitle,
    IonToolbar,
  },
});
</script>
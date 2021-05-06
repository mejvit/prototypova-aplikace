<template>
  <ion-page>
    <page-header>{{ title }}</page-header>
    <ion-content :fullscreen="true">
      <page-header-ios>{{ title }}</page-header-ios>
      <slot></slot>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import PageHeader from "@/components/PageHeader.vue";
import PageHeaderIos from "@/components/PageHeaderIos.vue";
import {
  IonContent, IonPage
} from "@ionic/vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "page-container",
  components: {
    IonContent, IonPage,
    PageHeader, PageHeaderIos
  },
  props: {
      title: String
  }
});
</script>
<template>
  <page-container title="Úvodní stránka">
    <ion-grid>
        <ion-row>
          <ion-col size="6" v-for="(link, i) in appLinks" :key="i" >
            <ion-card @click="() => router.push(link.route)" class="custom-card">
              <ion-card-header class="ion-text-center">
                <ion-icon :icon="link.icon" class="card-icon" color="tertiary"></ion-icon>
                <ion-card-title class="card-title">{{ link.name }}</ion-card-title>
              </ion-card-header>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
  </page-container>
</template>

<script lang="ts">
import {
  IonCard, IonCardHeader, IonCardTitle, IonCol, IonGrid, IonIcon, IonRow,
} from '@ionic/vue';
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import PageContainer from '@/components/PageContainer.vue';


export default defineComponent({
  name: 'Home',
  components: {
    IonCard, IonCardHeader, IonCardTitle, IonCol,
    IonGrid,
    IonIcon,
    IonRow,
    PageContainer
  },
  inject: ['appLinks'],
  setup() {    
    const router = useRouter();
    return {router}
  }
});
</script>

<style scoped>
.card-icon {
  width: 100%;
  font-size: 72px;
}

.card-title {
  padding-top: 1em;
  font-size: 2vh;
  height: 5vh;
}
</style>
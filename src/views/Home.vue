<template>
  <ion-page>
    <page-header>Úvodní stránka</page-header>    
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Blank</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-grid>
        <ion-row>
          <ion-col size="6" v-for="(link, i) in appLinks" :key="i" >
            <ion-card @click="() => router.push(link.route)" class="custom-card">
              <ion-card-header class="ion-text-center">
                <ion-icon :icon="link.icon" class="card-icon"></ion-icon>
                <ion-card-title>{{ link.name }}</ion-card-title>
              </ion-card-header>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import PageHeader from '../components/PageHeader.vue'
import {
  IonCard, IonCardHeader, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonPage, IonRow, IonTitle, IonToolbar
} from '@ionic/vue';
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';


export default defineComponent({
  name: 'Home',
  components: {
    IonCard, IonCardHeader, IonCardTitle, IonCol, IonContent,
    IonGrid,
    IonHeader,
    IonIcon,
    IonPage,
    IonRow,
    IonTitle, IonToolbar,
    PageHeader
  },
  inject: ['appLinks'],
  setup() {    
    const router = useRouter();
    return {router}
  }
});
</script>

<style scoped>
.custom-card {
  height: 25vh;
}

.card-icon {
  width: 100%;
  font-size: 72px;
}

#container {
  text-align: center;
  
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  
  color: #8c8c8c;
  
  margin: 0;
}

#container a {
  text-decoration: none;
}
</style>
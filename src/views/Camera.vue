<template>
  <page-container title="Fotoaparát">
    <div v-if="photos.length == 0" class="no-photos">
      <p>Zatím nebyly pořízeny žádné fotografie</p>
    </div>
    <ion-grid v-else>
      <ion-row>
        <ion-col size="6" :key="photo.webPath" v-for="photo in photos">
          <ion-img :src="photo.dataUrl" @click="showActionSheet(photo.dataUrl)"></ion-img>
        </ion-col>
      </ion-row>
    </ion-grid>
    <ion-fab vertical="bottom" horizontal="center" slot="fixed">
      <ion-fab-button @click="takePhoto()">
        <ion-icon :icon="camera"></ion-icon>
      </ion-fab-button>
    </ion-fab>
  </page-container>
</template>

<script lang="ts">
import { 
  IonCol, IonFab, IonFabButton, IonGrid, IonIcon, IonImg, IonRow, 
  actionSheetController
} from '@ionic/vue';
import { defineComponent, ref } from "vue";
import { Plugins, CameraResultType, CameraSource, CameraPhoto } from "@capacitor/core";
import { camera, close, trash } from 'ionicons/icons';
import PageContainer from "@/components/PageContainer.vue";

const { Camera } = Plugins;

export default defineComponent({
  name: "Camera",
  components: {
    IonCol, IonFab, IonFabButton, IonGrid, IonIcon, IonImg, IonRow,
    PageContainer
  },

  setup() {
   const photos = ref<CameraPhoto[]>([]);

    const takePhoto = async function() {
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        quality: 100
      });

      photos.value = [photo, ...photos.value];
      console.log(photos.value);
    };

    const deletePhoto = function(photo: string) {
      photos.value = photos.value.filter(p => p.webPath !== photo);
    };


    const showActionSheet = async function(photo: string) {
      const actionSheet = await actionSheetController.create(
        {
          header: 'Smazat obrázek?',
          buttons: [
            {
              text: 'Odstranit',
              role: 'destructive',
              icon: trash,
              handler: () => {
                deletePhoto(photo);
              }
            },
            {
              text: 'Zrušit',
              role: 'cancel',
              icon: close,
              handler: () => {return}
            }
          ]
        }
      );
      
      await actionSheet.present();
    };

    return {
      camera,
      photos,
      showActionSheet,
      takePhoto
    }
  }

});
</script>

<style scoped>
.no-photos {
  width: 100%;
  height: 80vh;
  display: flex;
}
.no-photos p {
  width: 100%;
  align-self: center;
  text-align: center;
}
</style>
<template>
  <ion-page>
    <page-header>Souborový systém</page-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <page-header-ios>Souborový systém</page-header-ios>
      <ion-list>
        <ion-item v-for="(file, i) in fileList" :key="i">
          <ion-icon slot="start" :icon="documentTextOutline"></ion-icon>
          <ion-grid>
            <ion-row>
              <ion-col size="10">
                <ion-text color="primary" @click="router.push('/filesystem/'+file.replace('.txt', ''))">{{ file }}</ion-text>
              </ion-col>
              <ion-col size="2">
                <span @click="showOptions(file)">
                  <ion-icon :icon="ellipsisHorizontal"></ion-icon>
                </span>
              </ion-col>
            </ion-row>
          </ion-grid>          
        </ion-item>
      </ion-list>
      <p class="filesystem-info">* soubory se ukládají do v adresáři dokumenty do složky prototypova_aplikace</p>
      <ion-fab vertical="bottom" horizontal="center" slot="fixed">
        <ion-fab-button router-link="/filesystem/create">
          <ion-icon :icon="addOutline"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import PageHeader from "@/components/PageHeader.vue";
import { 
  IonCol, IonContent, IonFab, IonFabButton, IonGrid, IonIcon,
  IonPage, IonRow, IonItem, IonList, IonText,
  alertController, actionSheetController, onIonViewWillEnter 
} from '@ionic/vue';
import { useRouter } from 'vue-router';
import { computed, defineComponent, onMounted, ref } from "vue";
import { addOutline, closeOutline, documentTextOutline, createOutline, ellipsisHorizontal, trashOutline } from 'ionicons/icons';
import { Plugins, FilesystemDirectory, ReaddirResult } from '@capacitor/core';
import PageHeaderIos from "@/components/PageHeaderIos.vue";




export default defineComponent({
  name: "FilesystemIndex",
  components: {
    IonCol, IonContent,
    IonFab, IonFabButton,
    IonGrid,
    IonIcon, IonItem,
    IonList,
    IonPage,
    IonRow,
    IonText,
    PageHeader,
    PageHeaderIos
  },
  setup() {
    const { Filesystem, Toast } = Plugins;
    const appDir = 'prototypova_aplikace';
    const dirContent= ref<ReaddirResult>();
    const fileList = computed(() => dirContent.value?.files);
    const router = useRouter();

    const loadFileList = async function () {      
      try {
        dirContent.value = await Filesystem.readdir({
          path: appDir,
          directory: FilesystemDirectory.Documents
        });
        console.log(dirContent.value);
      }
      catch(e) {
        console.error(e);
      }
    }

    const deleteFile = async function (fileName: string) {
      await Filesystem.deleteFile({
        path: appDir + '/'+ fileName,
        directory: FilesystemDirectory.Documents
      });
    }

    const renameFile = async function (from: string, to: string) {
      await Filesystem.rename({
        from: from,
        to: to,
        directory: FilesystemDirectory.Documents
      });
    }

    const showDeleteDialog = async function (fileName: string) {
      const alert = await alertController
        .create({
          header: 'Odstranit soubor?',
          message: 'Přejete si odstranit soubor?',
          buttons: [
            {
              text: 'Zrušit',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {return},
            },
            {
              text: 'Odstranit',
              handler: async () => {
                await deleteFile(fileName);
                await loadFileList();
              },
            },
          ],
        });
      return alert.present();
    }
    
    const showEditDialog = async function(fileName: string) {
      const alert = await alertController
        .create({
          cssClass: 'my-custom-class',
          header: 'Nový název souboru',
          inputs: [
            {
              name: 'newFileName',
              id: 'name2-id',
              value: fileName.replace(".txt", ""),
              placeholder: 'Nový název',
            }
          ],
          buttons: [
            {
              text: 'Zrušit',
              role: 'cancel',
              cssClass: 'secondary',
              handler: async (e) => {
                console.log(e);
              },
            },
            {
              text: 'Ok',
              handler: async (data) => {
                
                try {                            
                  if (data.newFileName.length < 3) {
                    await Toast.show({
                      text: "Chyba: Název musí mít aspoň 3 znaky."
                    });
                    return;
                  }
                  if (!data.newFileName.match(/^[0-9a-zA-Z_\-. ]+$/)) {
                    await Toast.show({
                      text: "Chyba: Neplatný název souboru."
                    });
                    return;
                  }
                  console.log('prototypova_aplikace/'+ fileName);
                  await renameFile('prototypova_aplikace/'+ fileName, 'prototypova_aplikace/'+ data.newFileName +'.txt');                  
                  loadFileList();
                } catch(e) {
                  console.error('Unable to rename file', e);
                }
              },
            },
          ],
        });
      return alert.present();
    }

    const showOptions = async function (fileName: string) {
      const actionSheet = await actionSheetController
        .create({
          header: 'Soubor ' + fileName,
          cssClass: 'my-custom-class',
          buttons: [
            {
              text: 'Přejmenovat',
              icon: createOutline,
              handler: () => {
                showEditDialog(fileName);
              },
            },
            {
              text: 'Odstranit',
              role: 'destructive',
              icon: trashOutline,
              handler: () => {
                showDeleteDialog(fileName);
              },
            },
            {
              text: 'Zrušit',
              icon: closeOutline,
              role: 'cancel',
              handler: () => { return },
            },
          ],
        });
      await actionSheet.present();
    }

    onIonViewWillEnter(async () => {
      await loadFileList();
    });

    onMounted(async () => {
      try {
        await Filesystem.mkdir({
          path: appDir,
          directory: FilesystemDirectory.Documents,
          recursive: false
        });
      }
      catch (e) {
        console.log(e);
      }

      await loadFileList();
    });

    return {
      addOutline,trashOutline,closeOutline,
      documentTextOutline,
      createOutline,
      ellipsisHorizontal,
      fileList,
      showOptions,
      showDeleteDialog,
      router
    }
  },
});
</script>

<style scoped>
  .filesystem-info {
    padding: 0.4em 1em;
    font-size: 0.8em;
    color: #949494;
  }
</style>


<template>
  <ion-page>
    <page-header>Informace o zařízení</page-header>
    <ion-content :fullscreen="true">
      <page-header-ios>Informace o zařízení</page-header-ios>
      <ion-list v-if="infoLoaded">
        <ion-list-header>
          <ion-label>Zařízení</ion-label>
        </ion-list-header>
        <ion-item v-if="'name' in deviceInfo">
          <ion-label>
            <h3>Název zařízení:</h3>
            <p>{{deviceInfo.name}}</p>
          </ion-label>
        </ion-item>
        <ion-item v-if="'model' in deviceInfo">
          <ion-label>
            <h3>Model:</h3>
            <p>{{deviceInfo.model}}</p>
          </ion-label>
        </ion-item>
        <ion-item v-if="'platform' in deviceInfo">
          <ion-label>
            <h3>Platforma:</h3>
            <p>{{deviceInfo.platform}}</p>
          </ion-label>
        </ion-item>
        <ion-item v-if="'uuid' in deviceInfo">
          <ion-label>
            <h3>UUID zařízení:</h3>
            <p>{{deviceInfo.uuid}}</p>
          </ion-label>
        </ion-item>
        <ion-item v-if="'appVersion' in deviceInfo">
          <ion-label>
            <h3>Verze aplikace:</h3>
            <p>{{deviceInfo.appVersion}}</p>
          </ion-label>
        </ion-item>
        <ion-item v-if="'appBuild' in deviceInfo">
          <ion-label>
            <h3>Verze sestavení:</h3>
            <p>{{deviceInfo.appBuild}}</p>
          </ion-label>
        </ion-item>
        <ion-item v-if="'appName' in deviceInfo">
          <ion-label>
            <h3>ID aplikace:</h3>
            <p>{{deviceInfo.appName}}</p>
          </ion-label>
        </ion-item>
        <ion-item v-if="'operatingSystem' in deviceInfo">
          <ion-label>
            <h3>Operační systém:</h3>
            <p>{{deviceInfo.operatingSystem}}</p>
          </ion-label>
        </ion-item>
        <ion-item v-if="'osVersion' in deviceInfo">
          <ion-label>
            <h3>Verze operačního systému:</h3>
            <p>{{deviceInfo.osVersion}}</p>
          </ion-label>
        </ion-item>
        <ion-item v-if="'manufacturer' in deviceInfo">
          <ion-label>
            <h3>Výrobce:</h3>
            <p>{{deviceInfo.manufacturer}}</p>
          </ion-label>
        </ion-item>
        <ion-item v-if="'isVirtual' in deviceInfo">
          <ion-label>
            <h3>Běží aplikace v emulátoru:</h3>
            <p>{{deviceInfo.isVirtual ? "Ano" : "Ne"}}</p>
          </ion-label>
        </ion-item>
        <ion-item v-if="'memUsed' in deviceInfo">
          <ion-label>
            <h3>Operační paměť využitá aplikací:</h3>
            <p>{{Math.round((deviceInfo.memUsed / 1048576)*100)/100}} MB</p>
          </ion-label>
        </ion-item>
        <ion-item v-if="'diskFree' in deviceInfo">
          <ion-label>
            <h3>Volné místo:</h3>
            <p>{{ Math.round(deviceInfo.diskFree / 10000000) / 100 }} GB</p>
          </ion-label>
        </ion-item>
        <ion-item v-if="'diskTotal' in deviceInfo">
          <ion-label>
            <h3>Celkové místo:</h3>
            <p>{{Math.round(deviceInfo.diskTotal / 10000000) / 100 }} GB</p>
          </ion-label>
        </ion-item>
        <ion-list-header>
          <ion-label>Stav baterie</ion-label>
        </ion-list-header>
        <ion-item>
          <ion-label>
            <h3>Baterie nabita na:</h3>
            <p>{{Math.round(batteryInfo.batteryLevel * 10000)/100}} %</p>
          </ion-label>
        </ion-item>
        <ion-item>
          <ion-label>
            <h3>Připojeno k nabíječce:</h3>
            <p>{{batteryInfo.isCharging ? "Ano" : "Ne"}}</p>
          </ion-label>
        </ion-item>
        <ion-list-header>
          <ion-label>Jazyk</ion-label>
        </ion-list-header>
        <ion-item>
          <ion-label>
            <h3>Kód aktuálního jazyka</h3>
            <p>{{languageCode.value}}</p>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import PageHeader from "@/components/PageHeader.vue";
import {
  IonContent, IonItem, IonLabel, IonList, IonListHeader, IonPage,
  loadingController
} from "@ionic/vue";
import { defineComponent, onMounted, ref } from "vue";
import { Plugins, DeviceInfo, DeviceBatteryInfo, DeviceLanguageCodeResult } from "@capacitor/core";
import PageHeaderIos from "@/components/PageHeaderIos.vue";

const { Device } = Plugins;

export default defineComponent({
  name: "Device",
  components: {
    IonContent, IonLabel, IonItem, IonList, IonListHeader, IonPage,
    PageHeader,
    PageHeaderIos,
  },
  setup() {
    const infoLoaded = ref<boolean>(false);
    
    const deviceInfo = ref<DeviceInfo>();
    const batteryInfo = ref<DeviceBatteryInfo>();
    const languageCode = ref<DeviceLanguageCodeResult>();

    onMounted(async () => {
      const loading = await loadingController
        .create({
          message: 'Načítám data...',
        });

      await loading.present();
      deviceInfo.value = await Device.getInfo();
      batteryInfo.value = await Device.getBatteryInfo();
      languageCode.value = await Device.getLanguageCode();
      
      infoLoaded.value = true;
      loading.dismiss();
    });

    return {
      deviceInfo,
      batteryInfo,
      languageCode,
      infoLoaded
    };
  },
});
</script>

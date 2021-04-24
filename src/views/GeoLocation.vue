<template>
  <ion-page>
    <page-header>Poloha zařízení</page-header>
    <ion-content :fullscreen="true">
      <dl v-if="coordsLoaded" class="coords">
        <dt>Zeměpisná šířka:</dt>
          <dd>{{ position.coords.latitude }}</dd>
        <dt>Zeměpisná délka:</dt>
          <dd>{{ position.coords.longitude }}</dd>
      </dl>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import PageHeader from "@/components/PageHeader.vue";
import { 
  IonContent, IonPage
} from '@ionic/vue';
import { defineComponent, onMounted, ref } from 'vue';
import { Plugins, GeolocationPosition } from "@capacitor/core";

const { Geolocation } = Plugins;

export default defineComponent({
  name: "GeoLocation",
  components: {
    IonContent, IonPage,
    PageHeader
  },
  setup() {
    const coordsLoaded = ref<boolean>(false);
    const position = ref<GeolocationPosition>();
    const getPosition = async () => {
      position.value = await Geolocation.getCurrentPosition();
      coordsLoaded.value = true;
    }

    const wait = Geolocation.watchPosition({}, (position, err) => {
      console.log("pos tracked");
      console.log(position);
    })

    onMounted(getPosition);
    return {
      coordsLoaded,
      position,
      getPosition
    }
  },
})
</script>

<style scoped>
  .coords {
    margin: 3em;
  }

  .coords dt {
    font-weight: bold;
    margin-top: 1em;
  }

  .coords dt:first-child {
    margin-top: 0;
  }

  .coords dd {
    margin-top: 0.5em;
  }
</style>
<template>
  <ion-page>
    <page-header>Poloha zařízení</page-header>
    <ion-content>
      <div style="width: 100vw; height: 50vh">
            <div ref="mapContainer" style="height: 100%; width: 100%;"></div>
      </div>
            <div v-if="coordsLoaded">
            <ion-item-divider color="secondary">
              <ion-label>Zeměpisná šířka</ion-label>
            </ion-item-divider>
            <ion-item>
              <ion-label>{{ position.coords.latitude }}</ion-label>
            </ion-item>
            <ion-item-divider color="tertiary">
              <ion-label>Zeměpisná délka</ion-label>
            </ion-item-divider>
            <ion-item>
              <ion-label>{{ position.coords.longitude }}</ion-label>
            </ion-item>
          </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import Feature from 'ol/Feature';
import View from 'ol/View';
import Map from 'ol/Map';
import Point from 'ol/geom/Point';
import {OSM, Vector as VectorSource} from 'ol/source';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import PageHeader from "@/components/PageHeader.vue";
import { 
  IonContent, IonItem, IonItemDivider, IonLabel, IonPage,
  loadingController
} from '@ionic/vue';
import { defineComponent, onMounted, ref } from 'vue';
import { Plugins, GeolocationPosition } from "@capacitor/core";
import {useGeographic} from 'ol/proj';

useGeographic();

const { Geolocation } = Plugins;

export default defineComponent({
  name: "GeoLocation",
  components: {
    IonContent, IonItem, IonItemDivider, IonLabel, IonPage, 
    PageHeader
  },
  setup() {
    const coordsLoaded = ref<boolean>(false);
    const position = ref<GeolocationPosition>();
    const mapContainer = ref<HTMLElement>();


    onMounted(async () => {
      const loading = await loadingController
        .create({
          message: 'Načítám data...',
        });

      await loading.present();
      position.value = await Geolocation.getCurrentPosition();
      coordsLoaded.value = true;
      const place = [position.value.coords.longitude, position.value.coords.latitude];
      //const place = [-110,25];
      console.log(place);
      const point = new Point(place);

      new Map({
        target: mapContainer.value,
        view: new View({
          zoom: 0,
          center: place,
          constrainResolution: true
        }),
        layers: [
          new TileLayer({
            source: new OSM()
          }),

          new VectorLayer({
            source: new VectorSource({
              features: [new Feature(point)],
            }),
            style: new Style({
              image: new CircleStyle({
                radius: 6,
                fill: new Fill({
                  color: '#3399CC',
                }),
                stroke: new Stroke({
                  color: '#fff',
                  width: 2,
                }),
              }),
            })
          })
        ],

      });
      
      loading.dismiss();

      
    });
    return {
      coordsLoaded,
      position,
      mapContainer
    }
  },
})
</script>
import { createApp } from 'vue'
import App from './App.vue'
import router from './router';

import { IonicVue } from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

import 'ol/ol.css';

/* Theme variables */
import './theme/variables.css';
/* PWA elements*/
import { defineCustomElements } from '@ionic/pwa-elements/loader'
defineCustomElements(window);

/* Capacitor SQLite */
import { isPlatform } from '@ionic/vue';
import { SQLiteDBConnection } from 'vue-sqlite-hook/dist';
/* Use SQLite in app */
import { useSQLiteInApp } from "./composables/useSQLiteInApp";

const app = createApp(App)
  .use(IonicVue)
  .use(router);

if (isPlatform('hybrid')) {
  const { getDbInstance } = useSQLiteInApp();    
  getDbInstance().then((db: SQLiteDBConnection) => {
    app.config.globalProperties.$database = db;
    router.isReady().then(() => {
      app.mount('#app');
    });
  });
}
else {
  router.isReady().then(() => {
    app.mount('#app');
  });
}




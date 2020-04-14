import Vue from 'nativescript-vue'
import App from './components/App'
import Connexion from './components/Connexion'

Vue.config.silent = false;

const appSettings = require("tns-core-modules/application-settings");
const connexion = require("connectivity");

new Vue({
    render: function(h) {
      if(appSettings.getString("user", false) || connexion.getConnectionType() == 0) return h("Frame", [h(App)])
      else return h("Frame", [h(Connexion)])
    }
}).$start()
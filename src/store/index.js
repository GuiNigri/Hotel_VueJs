import Vuex from "vuex";
import Vue from "vue";
import hotel from "./modules/hotel";

Vue.use(Vuex);

export default new Vuex.Store ({
  modules: {
    hotel
  }
});

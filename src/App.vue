<template>
  <b-container fluid id="app">
    <b-navbar type="dark" toggleable variant="dark" id="navbar">
      <b-navbar-brand :to="{ name: 'home' }" href="#"
        >hoteismaravilhosos.com</b-navbar-brand
      >
      <b-navbar-toggle target v-b-modal.modal-1>
        <b-icon icon="plus"></b-icon>
      </b-navbar-toggle>
    </b-navbar>
    <b-modal size="xl" id="modal-1" title="Adicionar/Atualizar Hotel" hide-footer hide-header-close scrollable no-close-on-backdrop> 
      <add-form :data="hotel"/>
    </b-modal>
    <router-view />
  </b-container>
</template>

<script>
import AddForm from "./components/AddForm";
import { EventBus } from './event-bus';

export default {
  name: "App",
  components: {
    AddForm,
  },
  data() {
    return {
      hotel: null,
    };
  },
  methods: {
    handleHotelData(hotel){
      this.hotel = hotel;
    }
  },
  created() {
    EventBus.$on('hotel-data-routed', this.handleHotelData)
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  padding-left: 0;
  padding-right: 0;
}

#navbar {
  margin-bottom: 20px;
  margin-left: 0;
  margin-right: 0;
}
</style>

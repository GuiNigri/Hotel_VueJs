<template>
  <div>
    <searchForm />
    <b-container fluid v-if="getHotels" style="margin-top: 30px">
      <b-row>
        <b-col
          cols="12"
          v-bind:key="hotel.id"
          v-for="hotel in this.getHotels"
          style="margin-bottom: 10px"
          id="cards-id"
        >
          <card :hotel="hotel" > </card>
        </b-col>
        <b-col
          v-if="this.getHotels.length > 0"
          cols="12"
          style="text-align: center; margin-bottom: 20px"
        >
          <b-button variant="primary" @click="nextPage">Carregar Mais</b-button>
        </b-col>
      </b-row>
    </b-container>
    <b-container v-else>
      <b-col cols="12" style="text-align: center">
        <img src="@/assets/loading.gif" />
      </b-col>
    </b-container>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import SearchForm from "./SearchForm";
import Card from "./Card";

export default {
  name: "Home",
  components: {
    SearchForm,
    Card,
  },
  computed: mapGetters(["getHotels", "getApiData", "getLoading"]),
  methods: {
    ...mapActions(["getHotelsByBaseInfoApi"]),
    nextPage(evt) {
      this.getHotelsByBaseInfoApi(this.getApiData);

      evt.preventDefault();
    },
  },
};
</script>

<style>
</style>
<template>
  <b-card no-body class="overflow-hidden" style="width: 100%; height: 250px">
    <b-row no-gutters>
      <b-col md="4" style="text-align: center">
        <b-card-img
          :src="hotel.optimizedThumbUrls.srpDesktop"
          alt="Image"
          class="rounded-0"
        ></b-card-img>
      </b-col>
      <b-col md="5">
        <b-card-body :title="hotel.name" style="text-align: left">
          <b-card-text>
            {{ hotel.address.streetAddress }}, {{ hotel.neighbourhood }},
            {{ hotel.address.locality }}, {{ hotel.address.postalCode }},
            {{ hotel.address.region }}, {{ hotel.address.countryName }}
          </b-card-text>
          <b-card-text>
            <b-icon
              icon="star-fill"
              v-for="n in hotel.starRating"
              :key="n + '-fill' + hotel.id"
              variant="warning"
            ></b-icon>
          </b-card-text>
        </b-card-body>
      </b-col>
      <b-col md="3">
        <b-card-body
          :title="hotel.ratePlan.price.current"
          style="text-align: right"
        >
          <b-card-text>
            {{ hotel.ratePlan.price.info }}
          </b-card-text>
          <b-card-text>
            {{ hotel.ratePlan.features.instalmentsMessage }}
          </b-card-text>
          <b-card-text>
            <b-button
              variant="primary"
              :to="{
                name: 'hotel',
                params: { id: hotel.id, hotelSearchData: this.getApiData, hotelData: this.hotel },
              }"
              >Reservar Agora</b-button
            >
          </b-card-text>
          <b-card-text>
            <b-button
              variant="danger"
              size="sm"
              style="margin-right: 5px"
              @click="deleteHotel(hotel.id)"
              ><b-icon icon="trash"></b-icon
            ></b-button>

            <b-button
              variant="warning"
              size="sm"
              @click="emitHotel(hotel)"
              ><b-icon icon="pencil"></b-icon
            ></b-button>
          </b-card-text>
        </b-card-body>
      </b-col>
    </b-row>
  </b-card>
</template>


<script>
import { mapGetters, mapActions } from "vuex";
import { EventBus } from '@/event-bus';

export default {
  name: "Card",
  props: {
    hotel: Object,
  },
  computed: mapGetters(["getApiData"]),
  methods: {
    ...mapActions(["deleteHotelByIdApi"]),
    deleteHotel(id) {
      this.deleteHotelByIdApi(id);
    },
    emitHotel(hotelData) {
      EventBus.$emit('hotel-data-routed', hotelData);
      this.$bvModal.show("modal-1")
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card {
  text-align: center;
}
</style>
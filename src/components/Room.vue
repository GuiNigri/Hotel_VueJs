<template>
  <div>
    <b-card
      v-bind:key="room.name"
      v-for="room in this.getRooms"
      no-body
      class="overflow-hidden"
      style="width: 100%; margin-bottom: 10px; height: 293px;"
    >
      <b-row no-gutters>
        <b-col md="4" style="text-align: center">
          <b-carousel
            id="carousel-2"
            :interval="4000"
            controls
            indicators
            background="#ababab"
            style="text-shadow: 1px 1px 2px #333"
            @sliding-start="onSlideStart"
            @sliding-end="onSlideEnd"
          >
            <b-carousel-slide
              v-bind:key="image.thumbnailUrl"
              v-for="image in room.images"
            >
              <template #img>
                <img
                  class="d-block w-100"
                  height="293px"
                  :src="image.fullSizeUrl"
                  alt="image slot"
                />
              </template>
            </b-carousel-slide>
          </b-carousel>
        </b-col>
        <b-col md="5">
          <b-card-body :title="room.name" style="text-align: left">
            <b-card-text v-if="room.ratePlans[0].cancellation.free">
              <p style="color: green; margin-bottom: 2px">
                Cancelamento Gratis
              </p>
              <p>{{ room.ratePlans[0].cancellation.additionalInfo }}</p>
            </b-card-text>
            <b-card-text v-else>
              <p style="color: red; margin-bottom: 2px">
                Essa acomodação não oferece cancelamento grátis
              </p>
            </b-card-text>
            <b-card-text>
              <p
                style="color: green; margin-bottom: 2px"
                v-for="feature in room.ratePlans[0].features"
                v-bind:key="feature.dataSourceInfo"
              >
                {{ feature.title }}
              </p>
            </b-card-text>
            <b-card-text v-if="room.maxOccupancy != undefined">
              <p style="margin-bottom: 2px">
                {{ room.maxOccupancy.messageTotal }}
              </p>
            </b-card-text>
          </b-card-body>
        </b-col>
        <b-col md="3">
          <b-card-body
            :title="room.ratePlans[0].price | formatAmount()"
            style="text-align: right"
          >
            <b-card-text>
              {{ room.ratePlans[0].instalmentsMessage }}
            </b-card-text>
            <b-button variant="primary">Reservar Agora</b-button>
          </b-card-body>
        </b-col>
      </b-row>
    </b-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Room",
  computed: mapGetters(["getRooms"]),
  data() {
    return {};
  },
  filters: {
    formatAmount: function (amount) {
      let formatedAmount;

      if(amount.totalPricePerStay != undefined){
        formatedAmount = amount.totalPricePerStay.replace(/[()]|(<([^>]+)>)/gi, "");
      }
      else
      {
        formatedAmount = amount.current;
      }
      
      return formatedAmount;
    },
  },
  methods: {
    onSlideStart() {
      this.sliding = true;
    },
    onSlideEnd() {
      this.sliding = false;
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
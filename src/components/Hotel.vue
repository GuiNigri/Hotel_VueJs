<template>
  <div>
    <b-container fluid v-if="getHotelDetails">
      <b-row>
        <b-col md="8" style="margin-bottom: 15px">
          <span style="display: inline-flex; align-items: center"
            ><h3>{{ getHotelDetails.name }}</h3>
            <p style="align-items: center; margin-bottom: 0; margin-left: 10px">
              {{ getHotelDetails.rating }}
            </p></span
          >
          <h5>{{ getHotelDetails.tagline }}</h5>
        </b-col>
        <b-col md="4" style="margin-bottom: 15px; text-align: right">
          <h3 style="color: red; font-weight: bold">
            {{ getHotelDetails.priceInfos.currentPrice.formatted }}
          </h3>
          <p style="margin-bottom: 3px">
            {{ getHotelDetails.priceInfos.totalPricePerStay }}
          </p>
          <p>{{ getHotelDetails.priceInfos.instalmentsMessage }}</p>
        </b-col>
      </b-row>
      <b-carousel
        id="carousel-1"
        :interval="4000"
        controls
        indicators
        background="#ababab"
        style="text-shadow: 1px 1px 2px #333"
        @sliding-start="onSlideStart"
        @sliding-end="onSlideEnd"
      >
        <b-carousel-slide
          v-bind:key="hotelImages.imageId"
          v-for="hotelImages in this.getHotelPhotos"
        >
          <template #img>
            <img
              class="d-block w-100"
              height="700px"
              max-width="100%"
              :src="hotelImages.baseUrl"
              alt="image slot"
            />
          </template>
        </b-carousel-slide>
      </b-carousel>
      <hr />
      <h4>Endereço</h4>
      <div>
        <p>{{ getHotelDetails.address.fullAddress }}</p>
        <div class="mapouter">
          <div class="gmap_canvas">
            <iframe
              width="100%"
              height="400"
              id="gmap_canvas"
              :src="getHotelDetails.map"
              frameborder="0"
              scrolling="no"
              marginheight="0"
              marginwidth="0"
            ></iframe>
          </div>
        </div>
      </div>  
      <div v-if="displayRooms">
        <hr />
        <h4>Quartos</h4>
        <room />
      </div>
    </b-container>
    <b-container v-else>
      <b-col cols="12" style="text-align: center">
        <img src="@/assets/loading.gif" />
      </b-col>
    </b-container>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Room from "./Room";

export default {
  name: "Hotel",
  components: {
    Room,
  },
  data() {
    return {
      hotelSearchData: this.$route.params.hotelSearchData,
      sliding: null,
      hotelData: this.$route.params.hotelData,
      displayRooms: true,
    };
  },
  computed: mapGetters(["getHotelPhotos", "getHotelDetails", "getLoading"]),
  methods: {
    ...mapActions([
      "getHotelPhotosByIdApi",
      "getHotelDetailsByIdApi",
      "setLoading",
      "getHotelDetailsCreatedWithoutAxios",
      "getHotelPhotosByIdCreatedWithoutAxios"
    ]),
    onSlideStart() {
      this.sliding = true;
    },
    onSlideEnd() {
      this.sliding = false;
    },
  },
  created() {
    let hotelId = this.$route.params.id;

    if (hotelId.length == 36) {

      this.displayRooms = false;
      
      let checkIn = new Date(this.hotelSearchData.checkIn);
      let checkOut = new Date(this.hotelSearchData.checkOut);

      let timeDiff = Math.abs(checkOut.getTime() - checkIn.getTime());
      let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

      this.hotelData.daily = diffDays;

      this.getHotelDetailsCreatedWithoutAxios(this.hotelData);
      this.getHotelPhotosByIdCreatedWithoutAxios(this.hotelData.optimizedThumbUrls.srpDesktop);

    } else {
      this.hotelSearchData.idHotel = hotelId;

      this.getHotelPhotosByIdApi(hotelId);
      this.getHotelDetailsByIdApi(this.hotelSearchData);
    }
  },
};
</script>

<style>
.gmap_canvas {
  overflow: hidden;
  background: none !important;
  height: 400px;
  width: 100%;
}
.mapouter {
  position: relative;
  text-align: right;
  height: 450px;
  width: 100%;
}
</style>
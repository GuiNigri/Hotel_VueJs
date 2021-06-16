<template>
  <div class="container-fluid">
    <form @submit="onSubmit">
      <h2 style="font-size: 1.5rem">Vai para onde?</h2>
      <div id="formOnly">
        <div class="form-group row">
          <div class="col-md-3">
            <label class="control-label" for="placesResults"
              >Destino (<a href="" @click="changePlacesSelection()">Alterar</a
              >)</label
            >
            <b-form-input
              v-if="showInput"
              v-model="destinationInput"
              class="form-control"
              id="placesQuery"
              @focusout="onKeyPressDestinationSelect"
            />
            <b-form-select
              v-else
              id="placesResults"
              class="form-control"
              :options="this.getOptionsPlaces"
              v-model="apiDataModel.destinationId"
              required
            />
          </div>
          <div class="col-md-3" style="padding-right: 0px">
            <label class="control-label" for="checkin">Check-In</label>
            <b-form-input
              id="checkin"
              class="form-control"
              type="date"
              required
              v-model="apiDataModel.checkIn"
              style="
                border-top-right-radius: 0px;
                border-bottom-right-radius: 0px;
              "
            />
          </div>
          <div class="col-md-3" style="padding-left: 0px">
            <label class="control-label" for="checkout">Check-Out</label>
            <b-form-input
              id="checkout"
              class="form-control"
              type="date"
              required
              v-model="apiDataModel.checkOut"
              style="
                border-top-left-radius: 0px;
                border-bottom-left-radius: 0px;
              "
            />
          </div>
          <div class="col-md-1">
            <label class="control-label" for="guests">Hospedes</label>
            <b-form-select
              id="guests"
              class="form-control"
              :options="guestQuantityOptions"
              v-model="apiDataModel.adults1"
              required
            />
          </div>
          <div
            class="col-md-2"
            style="text-align: center; align-self: flex-end"
          >
            <b-button variant="danger" type="submit">Buscar</b-button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "SearchForm",
  data() {
    return {
      showInput: true,
      destinationInput: "",
      apiDataModel: {
        adults1: "1", //'1'
        pageNumber: "", //'1'
        destinationId: null, //'1506246'
        checkOut: "", // '2020-01-15'
        checkIn: "", //'2020-01-08'
      },
      guestQuantityOptions: [
        { value: 1, text: "1" },
        { value: 2, text: "2" },
        { value: 3, text: "3" },
        { value: 4, text: "4" },
      ],
    };
  },
  computed: mapGetters(["getOptionsPlaces", "getLoading"]),
  methods: {
    ...mapActions([
      "getHotelsByBaseInfoApi",
      "getPlacesByQueryStringApi",
      "loading",
    ]),

    onSubmit(evt) {
      evt.preventDefault();

      if (
        new Date(this.apiDataModel.checkIn).toLocaleDateString("pt-BR", {
          timeZone: "UTC",
        }) < new Date().toLocaleDateString("pt-BR", { timeZone: "UTC" })
      ) {
        alert("Data de CheckIn Inferior a data atual");
      } else if (
        new Date(this.apiDataModel.checkIn).toLocaleDateString("pt-BR", {
          timeZone: "UTC",
        }) >
        new Date(this.apiDataModel.checkOut).toLocaleDateString("pt-BR", {
          timeZone: "UTC",
        })
      ) {
        alert("Datas Invalidas");
      } else {
        this.apiDataModel.pageNumber = "1";
        this.getHotelsByBaseInfoApi(this.apiDataModel);
      }
    },
    onKeyPressDestinationSelect() {
      if (this.destinationInput.length >= 3) {
        this.loading();
        this.getPlacesByQueryStringApi(this.destinationInput);

        this.showInput = false;
      }
    },
    changePlacesSelection() {
      event.preventDefault();

      this.showInput = true;
      this.apiDataModel.destinationId = null;
    },
  },
};
</script>

<style scoped>
.group input {
  height: 50px;
  border-radius: 5px;
}

button {
  height: 50px;
}

h2 {
  color: red;
}

form {
  background-color: #270570;
  height: 160px;
  justify-content: center;
  padding: 10px;
  border-radius: 10px;
}

#formOnly {
  margin-top: 20px;
}

.checkin {
  margin-right: 0px;
}

.checkout {
  margin-left: 0px;
}

label {
  color: white;
}
</style>
<template>
    <div>
      <form @submit="createHotel">
        <div class="form-group row">
          <div class="col-md-12">
            <label class="control-label" for="name">Nome do Hotel</label>
            <b-form-input id="name" required type="text" class="form-control" v-model="hotel.name" />
          </div>
        </div>
        <div class="form-group row">
          <div class="col-md-9">
            <label class="control-label" for="photo">Foto Principal (Url)</label>
            <b-form-input id="photo" required type="text" class="form-control" v-model="hotel.optimizedThumbUrls.srpDesktop" />
          </div>
          <div class="col-md-3">
            <label class="control-label" for="starRating">Estrelas</label>
            <b-form-select id="starRating" required class="form-control" v-model="hotel.starRating" :options="starSelect"/>
          </div>
        </div>
        <hr>
        <div class="form-group row">
          <div class="col-md-4">
            <label class="control-label" for="zipCode">CEP</label>
            <b-form-input id="zipCode" required class="form-control" v-model="hotel.address.postalCode"/>
          </div>
          <div class="col-md-8">
            <label class="control-label" for="street">Endereço</label>
            <b-form-input id="street" required class="form-control" v-model="hotel.address.streetAddress"/>
          </div>
        </div>
        <div class="form-group row">
          <div class="col-md-4">
            <label class="control-label" for="neighbourhood">Bairro</label>
            <b-form-input id="neighbourhood" required class="form-control" v-model="hotel.neighbourhood"/>
          </div>
          <div class="col-md-4">
            <label class="control-label" for="city">Cidade</label>
            <b-form-input id="city" required class="form-control" v-model="hotel.address.locality"/>
          </div>
          <div class="col-md-4">
            <label class="control-label" for="region">Estado</label>
            <b-form-input id="region" required class="form-control" v-model="hotel.address.region"/>
          </div>
        </div>
        <div class="form-group row">
          <div class="col-md-4">
            <label class="control-label" for="country">País</label>
            <b-form-input id="country" required class="form-control" v-model="hotel.address.countryName"/>
          </div>
        </div>
        <hr>
        <div class="form-group row">
          <div class="col-md-4">
            <label class="control-label" for="price">Preço</label>
            <b-form-input id="price" required type="number" class="form-control" v-model="hotel.ratePlan.price.current"/>
          </div>
          <div class="col-md-4">
            <label class="control-label" for="instalments">Parcelas sem Juros</label>
            <b-form-input id="instalments" required type="number" class="form-control" v-model="hotel.ratePlan.features.instalmentsMessage"/>
          </div>
        </div>
        <div class="form-group row">
          <div class="col-md-1">
            <b-button variant="primary" type="submit"> Salvar </b-button>
          </div>
          <div class="col-md-1">
            <b-button variant="danger" type="button" @click="closeModal()"> Cancelar </b-button>
          </div>
        </div>
      </form>
  </div>
</template>

<script>
import { mapActions } from "vuex";

import { uuid } from 'vue-uuid';

import { EventBus } from '@/event-bus';

export default {
  name: "AddForm",
  props: {
    data: Object
  },
  data() {
    return {
      hotel: {
        id: null,
        name: null,
        starRating: null,
        neighbourhood: "",
        optimizedThumbUrls: {
          srpDesktop: "",
        },
        address: {
          streetAddress: "",
          locality: "",
          region: "",
          postalCode: "",
          countryName: "",
        },
        ratePlan: {
          price: {
            current: null,
            info: "tarifa diária por quarto"
          },
          features: {
            instalmentsMessage: "",
          }
        },
      },
      starSelect: [
        {value: 1, text: "1"},
        {value: 2, text: "2"},
        {value: 3, text: "3"},
        {value: 4, text: "4"},
        {value: 5, text: "5"},
      ]
    };
  },
  methods: {
    ...mapActions(["AddHotel"]),
    createHotel(evt) {
      let msg = "";

      this.hotel.ratePlan.price.current = "R$ " + this.hotel.ratePlan.price.current;
      this.hotel.ratePlan.features.instalmentsMessage = "em até " + this.hotel.ratePlan.features.instalmentsMessage + "x sem juros";

      if(this.hotel.id == null){
        uuid.v1()
        this.hotel.id = this.$uuid.v4();

        this.AddHotel(this.hotel);
        
        msg = "Adicionado com sucesso";
      }
      else
      {
        msg = "Alterado com sucesso";
      }

      this.clearForm();
      this.closeModal();

      alert(msg);

      evt.preventDefault();
    },
    closeModal(){
      if(this.data != null){
        EventBus.$emit('hotel-data-routed', null);
      }
      
      this.$bvModal.hide("modal-1")
    },
    clearForm(){
      this.hotel = {
        id: null,
        name: null,
        starRating: "",
        neighbourhood: "",
        optimizedThumbUrls: {
          srpDesktop: "",
        },
        address: {
          streetAddress: "",
          locality: "",
          region: "",
          postalCode: "",
          countryName: "",
        },
        ratePlan: {
          price: {
            current: null,
            info: "tarifa diária por quarto"
          },
          features: {
            instalmentsMessage: "",
          }
        }
      }
    },
  },
  created(){
    if(this.data != null){
      this.hotel = this.data;
    }
  },
};
</script>

<style scoped>
  label{
    color: black;
  }
</style>
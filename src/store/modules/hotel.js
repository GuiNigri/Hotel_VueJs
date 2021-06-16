import axios from "axios";

var getHotelsByFilter = {
    method: 'GET',
    url: 'https://hotels4.p.rapidapi.com/properties/list',
    headers: {
        'x-rapidapi-key': '31cdb7e6cbmsh88e4b8304de7ed7p177ff1jsn246a48ef7802',
        'x-rapidapi-host': 'hotels4.p.rapidapi.com'
    }
};

var getPlacesSugestionsByFilter = {
    method: 'GET',
    url: 'https://hotels4.p.rapidapi.com/locations/search',
    headers: {
        'x-rapidapi-key': '31cdb7e6cbmsh88e4b8304de7ed7p177ff1jsn246a48ef7802',
        'x-rapidapi-host': 'hotels4.p.rapidapi.com'
    }
};

var getHotelPhotosById = {
    method: 'GET',
    url: 'https://hotels4.p.rapidapi.com/properties/get-hotel-photos',
    headers: {
        'x-rapidapi-key': '31cdb7e6cbmsh88e4b8304de7ed7p177ff1jsn246a48ef7802',
        'x-rapidapi-host': 'hotels4.p.rapidapi.com'
    }
};

var getHotelDetailsById = {
    method: 'GET',
    url: 'https://hotels4.p.rapidapi.com/properties/get-details',
    headers: {
        'x-rapidapi-key': '31cdb7e6cbmsh88e4b8304de7ed7p177ff1jsn246a48ef7802',
        'x-rapidapi-host': 'hotels4.p.rapidapi.com'
    }
};

function setHotelsByFilterApiParameters(apiDataModel) {
    getHotelsByFilter.params = {
        adults1: apiDataModel.adults1,
        pageNumber: apiDataModel.pageNumber,
        destinationId: apiDataModel.destinationId,
        checkOut: apiDataModel.checkOut,
        checkIn: apiDataModel.checkIn,
        pageSize: '25',
        sortOrder: 'BEST_SELLER',
        locale: 'pt_BR',
        currency: 'BRL'
    }
}

const state = {
    hotels: [],
    apiData: null,
    optionsPlaces: [{ value: null, text: "Buscando..." }],
    hotelPhotos: [],
    hotelDetails: [],
    loading: false,
    rooms: []
};

const getters = {
    getHotels: state => state.hotels,
    getApiData: state => state.apiData,
    getOptionsPlaces: state => state.optionsPlaces,
    getHotelPhotos: state => state.hotelPhotos,
    getHotelDetails: state => state.hotelDetails,
    getLoading: state => state.loading,
    getRooms: state => state.rooms
};

const actions = {
    getHotelsByBaseInfoApi({ commit }, apiDataModel) {
        commit('getHotels', "");

        setHotelsByFilterApiParameters(apiDataModel);

        axios.request(getHotelsByFilter).then(function (response) {
            let data = response.data.data.body.searchResults;
            let results = data.results;

            let nextPage = data.pagination.nextPageNumber;

            apiDataModel.pageNumber = nextPage;

            results.forEach(x => {
                if (x.ratePlan != undefined) {
                    if (!Number.isInteger(x.starRating)) {
                        x.starRating = Math.round(x.starRating);
                    }
                }
                else{
                    x.pop();
                }

            })

            commit('getHotels', results);
            commit('getApiData', apiDataModel);

        }).catch(function (error) {
            console.log(error);
        });
    },

    getPlacesByQueryStringApi({ commit }, place) {

        getPlacesSugestionsByFilter.params = {
            query: place,
            locale: 'pt_BR'
        }

        axios.request(getPlacesSugestionsByFilter).then(function (response) {
            let optionsForSelect = [{ value: null, text: "Selecione um destino" }];

            response.data.suggestions[0].entities.forEach(x => {
                let stringWithoutHTMLTags = x.caption.replace(/(<([^>]+)>)/gi, "");
                optionsForSelect.push({ value: x.destinationId, text: stringWithoutHTMLTags })
            })

            commit('getOptionsPlaces', optionsForSelect);
        }).catch(function (error) {
            console.log(error);
        });
    },
    getHotelDetailsByIdApi({ commit }, apiData) {
        commit('getHotelDetails', "");
        commit('getRooms', "");
        

        getHotelDetailsById.params = {
            id: apiData.idHotel,
            checkIn: apiData.checkIn,
            checkOut: apiData.checkOut,
            currency: 'BRL',
            locale: 'pt_BR',
            adults1: apiData.adults1,
        }

        axios.request(getHotelDetailsById).then(function (response) {

            let result = response.data.data.body;

            let totalPricePerStay = result.propertyDescription.featuredPrice.totalPricePerStay;

            if (totalPricePerStay != undefined) {
                result.propertyDescription.featuredPrice.totalPricePerStay = totalPricePerStay.replace(/[()]|(<([^>]+)>)/gi, "");
            }

            result.propertyDescription.tagline[0] = result.propertyDescription.tagline[0].replace(/<\/*b>/ig, "");

            let returnData = {
                name: result.propertyDescription.name,
                address: result.propertyDescription.address,
                rating: result.propertyDescription.starRatingTitle,
                priceInfos: result.propertyDescription.featuredPrice,
                map: `https://maps.google.com/maps?q=${result.propertyDescription.address.fullAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed`,
                tagline: result.propertyDescription.tagline[0]
            }

            commit('getHotelDetails', returnData);
            commit('getRooms', result.roomsAndRates.rooms);
        }).catch(function (error) {
            console.log(error);
        });
    },
    getHotelDetailsCreatedWithoutAxios({ commit }, hotelData){

        let price = hotelData.ratePlan.price.current.replace(/R\$ /igm, "");
        let totalPrice = Number(price) * hotelData.daily;

        let fullAddress = `${hotelData.address.streetAddress}, ${hotelData.neighbourhood}, ${hotelData.address.locality}, ${hotelData.address.postalCode}, ${hotelData.address.region}, ${hotelData.address.countryName}`;
        
        let returnData = {
            name: hotelData.name,
            address: {
                fullAddress: fullAddress,
            },
            rating: `${hotelData.starRating} estrelas`,
            priceInfos: {
                currentPrice: {
                    formatted: hotelData.ratePlan.price.current,
                },
                totalPricePerStay: `R$ ${totalPrice} para ${hotelData.daily} noites`,
                instalmentsMessage: hotelData.ratePlan.features.instalmentsMessage,
            },
            map: `https://maps.google.com/maps?q=${fullAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed`,
            tagline: "Hotel Maravilhoso"
        }

        commit('getHotelDetails', returnData);
    },
    getHotelPhotosByIdCreatedWithoutAxios({ commit }, hotelPhoto) {
        let photos = [{
            baseUrl: hotelPhoto,
        }];

        commit('getHotelPhotos', photos);

    },
    loading({ commit }) {
        commit('loading');
    },
    getHotelPhotosByIdApi({ commit }, hotelId) {

        getHotelPhotosById.params = {
            id: hotelId
        }

        axios.request(getHotelPhotosById).then(function (response) {
            let results = response.data.hotelImages;

            results.forEach(x => {
                let replaceUrlParameter = x.baseUrl.replace(/{size}/gi, "z");
                x.baseUrl = replaceUrlParameter;
            })


            commit('getHotelPhotos', results);
        }).catch(function (error) {
            console.log(error);
        });
    },
    deleteHotelByIdApi({ commit }, hotelId) {
        commit('deleteHotel', hotelId);
    },
    AddHotel({ commit }, data) {
        commit('addHotel', data);
    }
}

const mutations = {
    getHotels: (state, data) => (state.hotels = data),
    getApiData: (state, data) => (state.apiData = data),
    getOptionsPlaces: (state, data) => (state.optionsPlaces = data),
    getHotelPhotos: (state, data) => (state.hotelPhotos = data),
    getHotelDetails: (state, data) => (state.hotelDetails = data),
    loading: (state) => (state.optionsPlaces = [{ value: null, text: "Buscando..." }]),
    getRooms: (state, data) => (state.rooms = data),
    deleteHotel: (state, dataId) => (state.hotels = state.hotels.filter(x => x.id !== dataId)),
    addHotel: (state, data) => (state.hotels.push(data)),
}

export default {
    state,
    actions,
    getters,
    mutations
};
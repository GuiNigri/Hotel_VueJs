import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from './components/Home'
import Hotel from './components/Hotel'

Vue.use(VueRouter);

export default new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: "/hotel/:id",
            name: 'hotel',
            component: Hotel
        }
    ]
});
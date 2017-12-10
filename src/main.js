import Vue from 'vue'
import Vuetify from 'vuetify'
import './stylus/main.styl'
import './css/styles.css'
import App from './App'
import * as firebase from 'firebase'
import router from './router'
import { store } from './store'
import dateFilter from './filters/date'
import AlertComp from './components/shared/Alert.vue'
import EditMeetupDetails from './components/Meetup/Edit/EditMeetupDetails.vue'
import EditMeetupDateTime from './components/Meetup/Edit/EditMeetupDateTime.vue'
import RegisterDialog from './components/Meetup/Registration/RegisterDialog.vue'

Vue.use(Vuetify)
Vue.config.productionTip = false

Vue.filter('date', dateFilter)
Vue.component('app-alert', AlertComp)
Vue.component('app-edit-meetup-details', EditMeetupDetails)
Vue.component('app-edit-meetup-date-time', EditMeetupDateTime)
Vue.component('app-register-for-meetup', RegisterDialog)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  created () {
    firebase.initializeApp({
      apiKey: 'AIzaSyAmoApOIbsn4Lqs8kyFfUK8m9obScUy4c0',
      authDomain: 'test-meetup-app.firebaseapp.com',
      databaseURL: 'https://test-meetup-app.firebaseio.com',
      projectId: 'test-meetup-app',
      storageBucket: 'gs://test-meetup-app.appspot.com/'
    })
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$store.dispatch('autoSignin', user)
        this.$store.dispatch('fetchUserData')
      }
    })
    this.$store.dispatch('loadMeetups')
  }
})

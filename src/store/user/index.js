import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'

Vue.use(Vuex)

export default {
  state: {
    // user: {
    //   id: 'asdjis;d0o0493km',
    //   registeredMeetups: ['00rfpmskljmc0']
    // }
    user: null,
    loading: null,
    error: null
  },
  mutations: {
    setUser (state, payload) {
      state.user = payload
    },
    registerUserForMeetup (state, payload) {
      const id = payload.id
      if (state.user.registeredMeetups.findIndex(meetup => meetup.id === id) >= 0) {
        return
      }
      state.user.registeredMeetups.push(id)
      state.user.fbKeys[id] = payload.fbKey
    },
    unregisterUserFromMeetup (state, payload) {
      const registeredMeetups = state.user.registeredMeetups
      registeredMeetups.splice(registeredMeetups.findIndex(meetup => meetup.id === payload), 1)
      Reflect.deleteProperty(state.user.fbKeys, payload)
    }
  },
  actions: {
    signUpUser ({commit}, payload) {
      commit('setLoading', true)
      commit('clearError')
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
      .then(
        user => {
          commit('setLoading', false)
          const newUser = {
            id: user.uid,
            registeredMeetups: [],
            fbKeys: {}
          }
          commit('setUser', newUser)
        }
      )
      .catch(
        error => {
          commit('setLoading', false)
          commit('setError', error)
          console.log(error)
        }
      )
    },
    signInUser ({commit}, payload) {
      commit('setLoading', true)
      commit('clearError')
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
      .then(
        user => {
          commit('setLoading', false)
          let newUser = {
            id: user.uid,
            registeredMeetups: [],
            fbKeys: {}
          }
          commit('setUser', newUser)
        }
      )
      .catch(
        error => {
          commit('setLoading', false)
          commit('setError', error)
          console.log(error)
        }
      )
    },
    autoSignin ({commit}, payload) {
      commit('setUser', {
        id: payload.uid,
        registeredMeetups: [],
        fbKeys: {}
      })
    },
    fetchUserData ({commit, getters}, payload) {
      commit('setLoading', true)
      firebase.database().ref('/users/' + getters.user.id + '/registrations/').once('value')
      .then(data => {
        const dataIDs = data.val()
        let swapedIDs = {}
        let registeredMeetups = []
        for (let key in dataIDs) {
          registeredMeetups.push(dataIDs[key])
          swapedIDs[dataIDs[key]] = key
        }
        // console.log(registeredMeetups)
        // console.log(swapedIDs)
        const updatedUser = {
          id: getters.user.id,
          registeredMeetups: registeredMeetups,
          fbKeys: swapedIDs
        }
        commit('setLoading', false)
        commit('setUser', updatedUser)
      })
      .catch(error => {
        console.log(error)
        commit('setLoading', false)
      })
    },
    registerUserForMeetup ({commit, getters}, payload) {
      commit('setLoading', true)
      const user = getters.user
      firebase.database().ref('/users/' + user.id).child('/registrations')
      .push(payload)
      .then(data => {
        commit('setLoading', false)
        commit('registerUserForMeetup', {id: payload, fbKey: data.key})
      })
      .catch(error => {
        console.log(error)
        commit('setLoading', false)
      })
    },
    unregisterUserFromMeetup ({commit, getters}, payload) {
      commit('setLoading', true)
      const user = getters.user
      if (!user.fbKeys) {
        return
      }
      const fbKey = user.fbKeys[payload]
      firebase.database().ref('/users/' + user.id + '/registrations/').child(fbKey)
      .remove()
      .then(() => {
        commit('setLoading', false)
        commit('unregisterUserFromMeetup', payload)
      })
      .catch(error => {
        console.log(error)
        commit('setLoading', false)
      })
    },
    logout ({commit}) {
      firebase.auth().signOut()
      commit('setUser', null)
    }
  },
  getters: {
    user (state) {
      return state.user
    }
  }
}

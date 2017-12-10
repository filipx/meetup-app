import * as firebase from 'firebase'

export default {
  state: {
    loadedMeetups: [
      {
        imageUrl: 'https://www.city-journal.org/sites/cj/files/New-York.jpg',
        id: 'fn944oij0f9jc',
        title: 'Meetup in New York',
        date: '2017-07-17',
        location: 'New York',
        description: 'We will be talking about new ways of data bindig using Vue JS'
      },
      {
        imageUrl: 'https://static.pexels.com/photos/338515/pexels-photo-338515.jpeg',
        id: '00rfpmskljmc0',
        title: 'Meetup in Paris',
        date: '2017-07-19',
        location: 'Paris',
        description: 'It\'s Paris! Bring the bagets.'
      }
    ]
  },
  mutations: {
    setLoadedMeetups (state, payload) {
      // if (payload.length === 0) console.log('Prazan array!')
      // else console.log(payload)
      state.loadedMeetups = payload
    },
    createMeetup (state, payload) {
      state.loadedMeetups.push(payload)
    },
    updateMeetup (state, payload) {
      const meetup = state.loadedMeetups.find(meetup => {
        return meetup.id === payload.id
      })
      if (payload.title) {
        meetup.title = payload.title
      }
      if (payload.description) {
        meetup.description = payload.description
      }
      if (payload.date) {
        meetup.date = payload.date
      }
    }
  },
  actions: {
    loadMeetups ({commit}) {
      commit('setLoading', true)
      firebase.database().ref('meetups').once('value') // moze i .on() to je real time metoda npr. za push notifikacije, ali ovde nam ne treba
      .then((data) => {
        const meetups = []
        const obj = data.val()
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            meetups.push({
              id: key,
              title: obj[key].title,
              imageUrl: obj[key].imageUrl,
              description: obj[key].description,
              date: obj[key].date,
              location: obj[key].location,
              creatorId: obj[key].creatorId
            })
          }
        }
        commit('setLoadedMeetups', meetups)
        commit('setLoading', false)
      })
      .catch((error) => {
        commit('setLoading', false)
        console.log(error)
      })
    },
    createMeetup ({commit, getters}, payload) {
      const meetup = {
        title: payload.title,
        location: payload.location,
        // imageUrl: payload.imageUrl,
        description: payload.description,
        date: payload.date.toISOString(),
        creatorId: getters.user.id
      }
      let imageUrl
      let key
      firebase.database().ref('meetups').push(meetup)
      .then((data) => {
        // console.log(data)
        key = data.key

        // Reach out to firebase and store it
        // commit('createMeetup', {
        //   // da bi prosledio ceo meetup odjednom postoji spread syntax -> ...meetup, ali ova sintaksa nije podrzana u svim browserima
        //   // ...meetup,
        //   title: payload.title,
        //   location: payload.location,
        //   imageUrl: payload.imageUrl,
        //   description: payload.description,
        //   date: payload.date.toISOString(),
        //   id: key
        // })
        return key
      })
      .then(key => {
        const fileName = payload.image.name
        const ext = fileName.slice(fileName.lastIndexOf('.'))
        return firebase.storage().ref('meetups/' + key + '.' + ext).put(payload.image)
      })
      .then(fileData => {
        imageUrl = fileData.metadata.downloadURLs[0]
        console.log(imageUrl)
        return firebase.database().ref('meetups').child(key).update({imageUrl: imageUrl})
      })
      .then(() => {
        commit('createMeetup', {
          ...meetup,
          imageUrl: imageUrl,
          id: key
        })
      })
      .catch((error) => {
        console.log(error)
      })
    },
    updateMeetupData ({commit}, payload) {
      commit('setLoading', true)
      const updateObj = {}
      if (payload.title) {
        updateObj.title = payload.title
      }
      if (payload.description) {
        updateObj.description = payload.description
      }
      if (payload.date) {
        updateObj.date = payload.date
      }
      firebase.database().ref('meetups').child(payload.id).update(updateObj)
      .then(() => {
        commit('setLoading', false)
        commit('updateMeetup', payload)
      })
      .catch(error => {
        console.log(error)
        commit('setLoading', false)
      })
    }
  },
  getters: {
    loadedMeetups (state) {
      return state.loadedMeetups.sort((meetupA, meetupB) => {
        return meetupA.date > meetupB.date
      })
    },
    featuredMeetups (state, getters) {
      return getters.loadedMeetups.slice(0, 5)
    },
    loadedMeetup (state) {
      return (meetupId) => {
        return state.loadedMeetups.find((meetup) => {
          return meetup.id === meetupId
        })
      }
    }
  }
}

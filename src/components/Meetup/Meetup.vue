<template>
  <v-container>
    <v-layout row wrap v-if="loading">
      <v-flex xs12 class="text-xs-center">
        <div class="big_loader">
          <v-progress-circular indeterminate class="secondary--text" :width="7" :size="70"></v-progress-circular>
        </div>
      </v-flex>
    </v-layout>
    <v-layout row wrap v-else>
      <v-flex xs12>
        <v-card>
          <v-card-title>
            <h2 class="headline primary--text">{{ meetup.title }}</h2>
            <template v-if="userIsCreator">
              <v-spacer></v-spacer>
              <app-edit-meetup-details :meetup="meetup"></app-edit-meetup-details>
            </template>
          </v-card-title>
          <v-card-media
            :src="meetup.imageUrl"
            height="300px">
          </v-card-media>
          <v-card-text>
            <div class="primary--text">{{ meetup.date | date }} - {{ meetup.location }}</div>
            <div v-if="userIsCreator">
              <app-edit-meetup-date-time :meetup="meetup"></app-edit-meetup-date-time>
            </div>
            <div>
              <p>{{ meetup.description }}</p>
              <p class="primary--text">
                <v-icon>my_location</v-icon>
                <a :href="'https://www.google.rs/search?q=' + meetup.location" target="_blank">
                  <strong>{{ meetup.location }}</strong>
                </a>
              </p>
            </div>
          </v-card-text>
          <v-card-actions>
            <app-register-for-meetup :meetupId="meetup.id" v-if="userIsAuthenticated && !userIsCreator"></app-register-for-meetup>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  props: ['id'],
  computed: {
    meetup () {
      return this.$store.getters.loadedMeetup(this.id)
    },
    userIsAuthenticated () {
      return this.$store.getters.user !== null && this.$store.getters.user !== undefined
    },
    userIsCreator () {
      if (!this.userIsAuthenticated) {
        return false
      }
      return this.$store.getters.user.id === this.meetup.creatorId
    },
    loading () {
      return this.$store.getters.loading
    }
  }
}
</script>

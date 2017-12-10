<template>
  <v-container>
    <v-layout row wrap class="mb-3" v-for="meetup in meetups" :key="meetup.id">
      <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
        <v-card class="info">
          <v-container fluid>
            <v-layout row>
              <v-flex xs12 sm5 md4>
                <v-card-media
                  :src="meetup.imageUrl"
                  height="130px">
                </v-card-media>
              </v-flex>
              <v-flex xs12 sm7 md8>
                <v-card-title primary-title>
                  <div class="white--text">
                    <h3 class="headline mb-0">{{ meetup.title }}</h3>
                    <p>{{ meetup.date | date }}</p>
                  </div>
              </v-card-title>
              <v-card-actions>
                <v-btn :to="'/meetups/' + meetup.id">
                  View Meetup 
                  <v-icon right>arrow_forward</v-icon>
                </v-btn>
              </v-card-actions>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  computed: {
    meetups () {
      return this.$store.getters.loadedMeetups
    }
  }
}
</script>

<template>
  <v-container fluid px-0>
    <v-spacer></v-spacer>
    <v-layout row wrap>
       <v-flex xs12 sm6 class="text-xs-center text-sm-right">
         <v-btn large router to="/meetups" class="info">Explore meetups</v-btn>
       </v-flex>
       <v-flex xs12 sm6 class="text-xs-center text-sm-left">
         <v-btn large router to="/meetup/new" class="info">Organize meetups</v-btn>
       </v-flex>
    </v-layout>
    <v-layout v-if="loading">
      <v-flex xs12 class="text-xs-center">
        <div class="big_loader">
          <v-progress-circular indeterminate class="secondary--text" :width="7" :size="70"></v-progress-circular>
        </div>
      </v-flex>
    </v-layout>
    <v-layout row wrap class="mt-2" v-if="!loading && meetups.length > 0">
       <v-flex xs12>
         <v-carousel class="pointer">
           <v-carousel-item
            v-for="meetup in meetups" 
            :src="meetup.imageUrl" 
            :key="meetup.id"
            @click="onLoadMeetup(meetup.id)">
            <div class="carousel_title">
              {{ meetup.title }}
            </div>
            </v-carousel-item>
         </v-carousel>
       </v-flex>
    </v-layout>
    <v-layout row wrap class="mt-2">
       <v-flex xs12 class="text-xs-center">
         <h2 class="headline secondary--text">Join our awesome meetups!</h2>
       </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    computed: {
      meetups () {
        return this.$store.getters.featuredMeetups
      },
      loading () {
        return this.$store.getters.loading
      }
    },
    methods: {
      onLoadMeetup (id) {
        this.$router.push('/meetups/' + id)
      }
    }
  }
</script>

<style scoped>
.carousel_title {
  position: absolute;
  bottom: 50px;
  background-color: rgba(0,0,0,.5);
  color: white;
  font-size: 2em;
  padding: 5px 20px;
}
.big_loader {
  width: 100%;
  min-height: 100px;
  margin: 100px 0
}
</style>

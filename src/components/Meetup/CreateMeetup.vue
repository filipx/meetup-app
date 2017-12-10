<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm8 offset-sm2>
        <h2 class="headline secondary--text">Create a new Meetup</h2>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12>
        <form @submit.prevent="onCreateMeetup">
          <v-layout row>
            <v-flex xs12 sm8 offset-sm2>
              <v-text-field 
              name="title" 
              label="Title" 
              id="title" 
              v-model="title"
              required></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm8 offset-sm2>
              <v-text-field 
              name="location" 
              label="Location of the event" 
              id="location" 
              v-model="location"
              required></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm8 offset-sm2>
              <!-- <v-text-field name="imageUrl" label="Image Url" id="imageUrl" v-model="imageUrl" required></v-text-field> -->
              <v-btn class="success" @click="onFileUpload" v-bind="columnFix">
                Choose file
                <v-icon right>file_upload</v-icon>
              </v-btn>
              <input type="file" style="display: none;" ref="fileInput" accept="image/*" @change="onUploadedFile">
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm8 offset-sm2>
              <img :src="imageUrl" alt="" width="100%">
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm8 offset-sm2>
              <v-text-field 
              name="description" 
              label="Descripton" 
              id="description"
              v-model="description"
              multi-line
              required></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm8 offset-sm2>
              <h3 class="headline secondary--text">Choose a date and time</h3>
            </v-flex>
          </v-layout>
          <v-layout row justify-center v-bind="columnFix">
            <v-flex xs12 md6 lg8 offset-md2 mb-5>
              <v-date-picker v-model="date"></v-date-picker>
              <!-- <p>{{ date }}</p> -->
            </v-flex>
            <v-flex xs12 md8 mb-5>
              <v-time-picker v-model="time" format="24hr"></v-time-picker>
              <!-- <p>{{ time }}</p> -->
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm8 offset-sm2>
              <v-btn
              class="success" 
              :disabled="!formIsValid"
              type="submit"
              v-bind="columnFix">Create Meetup 
              <v-icon v-if="formIsValid">chevron_right</v-icon>
              </v-btn>
              <br>
              {{ formatDateTime | date}}
            </v-flex>
          </v-layout>
        </form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      title: '',
      location: '',
      imageUrl: '',
      description: '',
      date: new Date(),
      time: new Date(),
      image: null
    }
  },
  computed: {
    columnFix () {
      const columnFix = {}
      if (this.$vuetify.breakpoint.smAndDown) {
        columnFix.column = true
        columnFix.block = true
      }
      return columnFix
    },
    // moze da se koristi v-validate package za validaciju
    formIsValid () {
      return this.title !== '' &&
             this.location !== '' &&
             this.imageUrl !== '' &&
             this.description !== ''
    },
    formatDateTime () {
      const date = new Date(this.date)
      if (typeof this.time === 'string') {
        const hours = this.time.match(/^(\d+)/)[1]
        const minutes = this.time.match(/:(\d+)/)[1]
        date.setHours(hours)
        date.setMinutes(minutes)
      } else {
        date.setHours(this.time.getHours())
        date.setMinutes(this.time.getMinutes())
      }
      // console.log(date)
      return date
    }
  },
  methods: {
    onCreateMeetup () {
      if (!this.formIsValid) {
        return
      }
      if (!this.image) {
        return
      }
      const meetupData = {
        title: this.title,
        location: this.location,
        // imageUrl: this.imageUrl, // ovo smo koristili kad smo dispatchovali link ka slici, a ne sam fajl
        image: this.image,
        description: this.description,
        date: this.formatDateTime
      }
      this.$store.dispatch('createMeetup', meetupData)
      this.$router.push('/meetups')
    },
    onFileUpload () {
      this.$refs.fileInput.click()
    },
    onUploadedFile (event) {
      const files = event.target.files
      let fileName = files[0].name
      if (fileName.lastIndexOf('.') <= 0) {
        return alert('Please upload a valid image!')
      }
      // konvertovanje slike u base64 format -> string value
      const fileReader = new FileReader()
      fileReader.addEventListener('load', () => {
        this.imageUrl = fileReader.result
      })
      fileReader.readAsDataURL(files[0])
      this.image = files[0]
    }
  }
}
</script>

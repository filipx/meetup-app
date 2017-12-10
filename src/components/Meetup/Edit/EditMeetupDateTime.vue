<template>
  <v-dialog width="400px" persistent scrollable v-model="editDialog">
    <v-btn outline accent slot="activator" mx-0>
      Edit Date and Time <v-icon right>mode_edit</v-icon>
    </v-btn>
    <v-card>
      <v-container>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-title class="headline">Edit Date and Time</v-card-title>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-text style="height: 450px;">
              <v-date-picker v-model="editedDate" style="width:100%;" class="mb-3" actions></v-date-picker>
              <v-time-picker v-model="editedTime" format="24hr" style="width:100%;" actions></v-time-picker>
            </v-card-text>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-actions>
              <v-btn block class="blue--text darken-1" flat @click="editDialog = false">Cancel</v-btn>
              <v-btn block class="primary--text darken-1" flat @click="onSaveChanges">Save</v-btn>
            </v-card-actions>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ['meetup'],
  data () {
    return {
      editDialog: false,
      editedDate: null,
      editedTime: null
    }
  },
  methods: {
    onSaveChanges () {
      this.editDialog = false
      const newDate = new Date(this.meetup.date)
      const newDay = new Date(this.editedDate).getDate()
      const newMonth = new Date(this.editedDate).getMonth()
      const newYear = new Date(this.editedDate).getFullYear()
      const newHours = this.editedTime.match(/^(\d+)/)[1]
      const newMinutes = this.editedTime.match(/:(\d+)/)[1]
      newDate.setDate(newDay)
      newDate.setMonth(newMonth)
      newDate.setFullYear(newYear)
      newDate.setHours(newHours)
      newDate.setMinutes(newMinutes)
      this.$store.dispatch('updateMeetupData', {
        id: this.meetup.id,
        date: newDate
      })
    }
  },
  created () {
    this.editedDate = new Date(this.meetup.date)
    this.editedTime = new Date(this.meetup.date).toTimeString()
    console.log(this.meetup)
  }
}
</script>

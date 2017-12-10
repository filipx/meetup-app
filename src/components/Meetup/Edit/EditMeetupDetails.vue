<template>
  <v-dialog width="350px" persistent v-model="editDialog">
    <v-btn outline fab accent slot="activator">
      <v-icon>mode_edit</v-icon>
    </v-btn>
    <v-card>
      <v-container>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-title class="headline">Edit Meetup</v-card-title>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-text>
              <v-text-field name="title" label="Title" id="title" required v-model="editedTitle"></v-text-field>
              <v-text-field name="description" label="Descripton" id="description" multi-line required v-model="editedDescription"></v-text-field>
            </v-card-text>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-actions>
              <v-btn class="blue--text darken-1" flat @click="editDialog = false">Cancel</v-btn>
              <v-spacer></v-spacer>
              <v-btn class="blue--text darken-1" flat @click="onSaveChanges">Save</v-btn>
            </v-card-actions>
          </v-flex>
        </v-layout>
      </v-container>
<!--       
      <v-card-title>Edit Meetup</v-card-title>
      <v-divider></v-divider>
      <v-card-text style="height: 300px;">

      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="blue darken-1" flat @click.native="dialog = false">Close</v-btn>
        <v-btn color="blue darken-1" flat @click.native="dialog = false">Save</v-btn>
      </v-card-actions> -->
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ['meetup'],
  data () {
    return {
      editDialog: false,
      editedTitle: this.meetup.title,
      editedDescription: this.meetup.description
    }
  },
  methods: {
    onSaveChanges () {
      if (this.editedTitle.trim() === '' || this.editedDescription.trim() === '') {
        return
      }
      this.editDialog = false
      this.$store.dispatch('updateMeetupData', {
        id: this.meetup.id,
        title: this.editedTitle,
        description: this.editDescription
      })
    }
  }
}
</script>

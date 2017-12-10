<template>
  <v-container>
    <v-layout row v-if="error">
      <v-flex xs12 sm8 offset-sm2>
        <app-alert @dismissed="onDismissed" :text="error.message"></app-alert>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex xs12 sm8 offset-sm2>
        <v-card>
          <v-card-text>
            <v-container>
              <form @submit.prevent="onSignup">
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field name="username" type="username" label="Username" id="Username" v-model="username"></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <span>Upload your profile picture (avatar):</span>
                    <br>
                    <v-btn class="success" @click="onFileUpload">
                      Choose file
                      <v-icon right>file_upload</v-icon>
                    </v-btn>
                    <input type="file" style="display: none;" ref="fileInput" accept="image/*" @change="onUploadedFile">
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12 sm8 offset-sm2>
                    <img :src="avatarImg" alt="" width="100%">
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field name="email" type="email" label="E-mail" id="Email" v-model="email" required></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field name="password" type="password" label="Password" id="Password" v-model="password" required></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field :rules="[confirmPasswords]" name="confirmPassword" type="password" label="Confirm Password" id="ConfirmPassword" v-model="confirmPassword" required></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-btn class="primary" type="submit" :disabled="loading" :loading="loading" @click.native="loader = 'loading'">
                      Sing Up
                      <span slot="loader" class="custom-loader">
                        <v-icon light>cached</v-icon>
                      </span>
                    </v-btn>
                  </v-flex>
                </v-layout>
              </form>
            </v-container>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      username: '',
      avatarImg: '',
      email: '',
      password: '',
      confirmPassword: '',
      avatar: null
    }
  },
  computed: {
    confirmPasswords () {
      return this.password !== this.confirmPassword ? 'Passwords do not mach!' : ''
    },
    user () {
      return this.$store.getters.user
    },
    error () {
      return this.$store.getters.error
    },
    loading () {
      return this.$store.getters.loading
    }
  },
  watch: {
    user (value) {
      if (value !== null && value !== undefined) {
        this.$router.push('/')
      }
    }
  },
  methods: {
    onSignup () {
      const userData = {
        username: this.username,
        email: this.email,
        password: this.password,
        avatar: this.avatar
      }
      this.$store.dispatch('signUpUser', userData)
      // console.log({email: this.email, password: this.password, confirmPassword: this.confirmPassword})
    },
    onDismissed () {
      console.log('Dismissed Alert!')
      this.$store.dispatch('clearError')
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
        this.avatarImg = fileReader.result
      })
      fileReader.readAsDataURL(files[0])
      this.image = files[0]
    }
  }
}
</script>

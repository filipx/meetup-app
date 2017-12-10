<template>
  <v-app>
    <v-navigation-drawer v-model="sideNav" right temporary>
      <v-list>
        <v-btn @click.stop="sideNav = !sideNav" class="secondary--text" fab outline small>
          <v-icon>clear</v-icon>
        </v-btn>
        <v-divider></v-divider>
        <v-list-tile v-for="item in menuItemsLogged" :key="item.title" router :to="item.link">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            {{ item.title }}
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-if="userIsAuthenticated" @click="onLogout">
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            Logout
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar class="primary" dark>
      <v-toolbar-title>
        <router-link to="/" tag="span" class="pointer">MeetUp</router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-side-icon @click.native.stop="sideNav = !sideNav" class="hidden-sm-and-up"></v-toolbar-side-icon>
      <v-toolbar-items  class="hidden-xs-only">
        <v-btn flat v-for="item in menuItemsLogged" :key="item.title" :to="item.link">
          {{ item.title }}
          <v-icon right>{{ item.icon }}</v-icon>
        </v-btn>
        <v-btn flat v-if="userIsAuthenticated" @click="onLogout">
          Logout
          <v-icon right>exit_to_app</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    
    <main>
      <router-view></router-view>
    </main>
  </v-app>
</template>

<script>
  export default {
    data () {
      return {
        sideNav: false
      }
    },
    computed: {
      menuItemsLogged () {
        let menuItems = [
          { icon: 'view_list', title: 'View Meetups', link: '/meetups' },
          { icon: 'face', title: 'Sign Up', link: '/signup' },
          { icon: 'lock_open', title: 'Sign In', link: '/signin' }
        ]
        if (this.userIsAuthenticated) {
          menuItems = [
            { icon: 'view_list', title: 'View Meetups', link: '/meetups' },
            { icon: 'room', title: 'Organize Meetup', link: '/meetup/new' },
            { icon: 'person', title: 'Profile', link: '/profile' }
          ]
        }
        return menuItems
      },
      userIsAuthenticated () {
        return this.$store.getters.user !== null && this.$store.getters.user !== undefined
      }
    },
    methods: {
      onLogout () {
        this.$store.dispatch('logout')
      }
    }
  }
</script>
<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container">
      <router-link to="/" class="navbar-brand">TodoList</router-link>

      <div class="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
        <ul class="navbar-nav">
          <li v-if="!isLogin" class="nav-item">
            <a href="/api/auth/login" class="nav-link">Login</a>
          </li>
          <li v-else class="nav-item dropdown">
            <a
              href="#"
              class="nav-link dropdown-toggle"
              id="navbarDropdownMenuLink"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >{{username}}</a>
            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownMenuLink">
              <a href="/#" class="dropdown-item" @click.stop.prevent="logout()">Logout</a>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  data(){
    return {

    };
  },
  
  computed: {
    username() {
      return this.$store.state.user;
    },

    isLogin() {
      return this.$store.state.isLogin;
    }
  },

  methods: {
    async getLoginUser() {
      try {
        const res = await fetch("/api/auth/check_login");
        const data = await res.json();
        if (data.username) {
          this.$store.commit("login", data.username);
        }
      } catch (err) {
        console.log(err);
      }
    },

    logout() {
      axios.post("/api/auth/logout")
      .then(res => {
        this.$store.commit("logout");
        this.eventList = [];
      }).catch(err => {
        console.log(err);
      });
    },
  }
}
</script>

<style lang="scss" scoped>

</style>

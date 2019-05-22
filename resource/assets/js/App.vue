<template>
  <div id="app">
    <navbar />
    <router-view></router-view>
  </div>
</template>

<script>
import NavBar from "./component/Layout/NavBar.vue";

export default {
  components: {
    "navbar": NavBar,
  }
};
</script>

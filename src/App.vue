<template>
<div id="app">
  <v-app>
    <Header/>
    <v-content>
      <router-view></router-view>
    </v-content>
    <BottomNavigation/>
  </v-app>
</div>
</template>

<script>
import Header from "./components/Header";
import BottomNavigation from "./components/BottomNavigation";
export default {
  name: "App",
  components: {
    BottomNavigation,
    Header
  },
  data() {
    return {};
  }
};
</script>

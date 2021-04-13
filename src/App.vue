<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
// import firebase from "firebase";
export default {
  name: "App",
  // data() {
  //   return {
  //     user: firebase.auth().currentUser,
  //   };
  // },
  mounted() {
    // if (this.user) {
    //   if (this.$route.name !== "/users") {
    //     this.$router.push("/users").catch(() => {});
    //   }
    // } else {
    //   if (this.$route.name === "signupPage") {
    //     this.$router.push("/signupPage").catch(() => {});
    //   } else if (this.$route.name === "login") {
    //     this.$router.push("/login").catch(() => {});
    //   }
    // }
  },
};
</script>

<style>
#app {
  font-family: "Arsenal", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>

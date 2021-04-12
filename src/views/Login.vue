<template>
  <div class="form-container">
    <div class="form-content-left">
      <img src="../assets/banner.svg" alt="spaceship" class="form-image" />
    </div>
    <div class="form-content-right">
      <FormLogin></FormLogin>
    </div>
  </div>
</template>
<script>
import FormLogin from "../components/Login/FormLogin.vue";
export default {
  components: { FormLogin },
  data: () => ({}),
  methods: {},
  mounted() {},
};
</script>

<style scoped>
.form-container {
  min-height: 100vh;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}
.form-container .form-content-left {
  width: 50%;
}
.form-container .form-content-right {
  width: 50%;
}
.form-content-left .form-image {
  display: block;
  margin: 0 auto;
  width: 60%;
}
</style>
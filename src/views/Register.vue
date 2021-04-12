<template>
  <div class="form-container">
    <form class="form">
      <h1 class="title">Register Account</h1>
      <InputField
        :type="`text`"
        :name="`input gmail`"
        :label="`Gmail`"
        :icon="`fa fa-envelope`"
        :placeHolder="`Gmail`"
        @input="username = $event"
      />
      <InputField
        :type="`password`"
        :name="`input password`"
        :label="`Password`"
        :icon="`fa fa-key`"
        :placeHolder="`Password`"
        @input="password = $event"
      />
      <button
        type="submit"
        class="button-login"
        @click="registerAccount($event)"
      >
        Register
      </button>
      <p class="link-create">
        Already have account? <a :href="'/login'">Sign in</a>
      </p>
    </form>
  </div>
</template>

<script>
import InputField from "../components/InputField/InputField.vue";
import firebase from "firebase";
export default {
  components: { InputField },
  data: () => {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    registerAccount(event) {
      event.preventDefault();
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.username, this.password)
        .then(() => {
          this.$router.push("/login").catch(() => {});
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style scoped>
.form-container .form {
  background: rgb(252, 251, 251);
  padding: 20px 50px;
  border-radius: 25px;
  width: 350px;
  box-shadow: 0 19px 38px rgba(0, 0, 0, 0.3), 0 15px 12px rgba(0, 0, 0, 0.22);
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -30%);
}
.form-container .title {
  text-align: center;
  font-family: "Arsenal", sans-serif;
  font-weight: 800;
  font-size: 40px;
  color: #6c63ff;
}
.form-container .button-login {
  width: 100%;
  height: 40px;
  font-size: 18px;
  text-transform: uppercase;
  letter-spacing: 2.5px;
  background: #6c63ff;
  color: white;
  border: none;
  border-radius: 45px;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.22);
  cursor: pointer;
  outline: none;
  margin-top: 10px;
}
.pagination {
  height: 1px;
  width: 100%;
  background-color: rgb(187, 179, 179);
}
p.link-create {
  text-align: center;
  font-family: "Arsenal", sans-serif;
}
p.link-create a {
  text-decoration: none;
  color: #6c63ff;
}
</style>
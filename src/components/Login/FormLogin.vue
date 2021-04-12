<template>
  <div class="form-container">
    <form class="form">
      <h1 class="title">Login</h1>
      <InputField
        :type="`text`"
        :name="`input username`"
        :label="`UserName`"
        :icon="`fa fa-user`"
        :placeHolder="`Input username ...`"
        :value="username"
        @input="username = $event"
      />
      <InputField
        :type="`password`"
        :name="`input password`"
        :label="`Password`"
        :icon="`fa fa-key`"
        :placeHolder="`Input password ...`"
        :value="password"
        @input="password = $event"
      />
      <button
        type="submit"
        class="button-login"
        @click="loginWithGmail($event)"
      >
        Login
      </button>
      <div style="text-align: center">OR</div>
      <div class="row button-google">
        <div class="col-md-3">
          <button
            class="btn btn-outline-dark button-login-google"
            role="button"
            @click="loginWithGoogleSubmit($event)"
            style="text-transform: none"
          >
            <img
              width="20px"
              style="margin-bottom: 3px; margin-right: 5px"
              alt="Google sign-in"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
            />
            Login with Google
          </button>
        </div>
      </div>
      <div style="margin-top: 25px" class="pagination" />
      <p class="link-create">
        Don't have account? <a :href="`/signupPage`">Register Here</a>
      </p>
    </form>
  </div>
</template>

<script>
import InputField from "../InputField/InputField.vue";
import firebase from "firebase";
export default {
  components: { InputField },
  data: () => ({
    username: "",
    password: "",
  }),
  methods: {
    loginWithGmail(event) {
      event.preventDefault();
      firebase
        .auth()
        .signInWithEmailAndPassword(this.username, this.password)
        .then((userCredential) => {
          // Signed in
          var user = userCredential.user;
          console.log(user);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    loginWithGoogleSubmit(event) {
      event.preventDefault();
      var provider = new firebase.auth.GoogleAuthProvider();
      firebase
        .auth()
        .signInWithPopup(provider)
        .then((userCredential) => {
          var user = userCredential.user;
          console.log(user);
          if (this.$route.name !== "/chatPage") {
            this.$router.push("/chatPage").catch(() => {});
          }
        })
        .catch((error) => {
          // Handle Errors here.
          var errorCode = error.code;
          console.log(errorCode);
          // ...
        });
    },
  },
};
</script>

<style scoped>
.form-container .form {
  margin: 0 auto;
  background: rgb(252, 251, 251);
  padding: 20px 50px;
  border-radius: 25px;
  width: 350px;
  min-height: 400px;
  box-shadow: 0 19px 38px rgba(0, 0, 0, 0.3), 0 15px 12px rgba(0, 0, 0, 0.22);
  align-items: center;
}
.form-container .title {
  text-align: center;
  font-family: "Arsenal", sans-serif;
  font-weight: 800;
  font-size: 50px;
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
.form-container .button-login:hover {
  background: black;
  color: white;
}
.button-google {
  margin-left: 8%;
}

.form-container .button-login-google {
  border-radius: 45px;
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
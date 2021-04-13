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
      <!-- <div style="text-align: center">OR</div> -->
      <!-- <div class="row button-google">
        <div class="col-md-3">
          <button
            class="btn btn-outline-dark button-login-google"
            role="button"
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
      </div> -->
      <div style="margin-top: 25px" class="pagination" />
      <p class="link-create">
        Don't have account? <a :href="`/signupPage`">Register Here</a>
      </p>
    </form>
  </div>
</template>

<script>
import InputField from "../InputField/InputField.vue";
import firebase from "../../services/firebase";
import Vue from "vue";
export default {
  components: { InputField },
  data: () => ({
    db: firebase.firestore(),
    username: "",
    password: "",
    user: "",
  }),
  methods: {
    loginWithGmail(event) {
      event.preventDefault();
      const auth = firebase.auth();
      auth
        .signInWithEmailAndPassword(this.username, this.password)
        .then(async (res) => {
          const user = res.user;
          if (user) {
            await this.db
              .collection("users")
              .where("id", "==", user.uid)
              .get()
              .then(async (querySnapshot) => {
                await querySnapshot.forEach(async (doc) => {
                  this.findUser = doc.data();
                  localStorage.setItem("FirebaseDocumentId", doc.id);
                });
                localStorage.setItem("userUID", this.findUser.id);
                localStorage.setItem("displayName", this.findUser.name);
                localStorage.setItem("photoUrl", this.findUser.URL);
                localStorage.setItem("email", this.findUser.email);
                localStorage.setItem("description", this.findUser.description);
                await this.db
                  .collection("users")
                  .doc(localStorage.getItem("FirebaseDocumentId"))
                  .update({
                    status: true,
                  })
                  .then(() => {
                    this.$router.push("/users");
                    Vue.toasted.show("Login successfully.").goAway(2000);
                  })
                  .catch((error) => {
                    console.log("Error getting documents: ", error);
                    Vue.toasted.show("Login failed!").goAway(2000);
                  });
              })
              .catch((error) => {
                console.log("Error getting documents: ", error);
                Vue.toasted.show("Login failed!").goAway(2000);
              });
            console.log(this.findUser);
          }
          // console.log(user);
        })
        .catch((error) => {
          console.log(error);
          Vue.toasted.show(error.message).goAway(2000);
        });
    },
    async loginWithGoogleSubmit(event) {
      event.preventDefault();
      var provider = new firebase.auth.GoogleAuthProvider();
      firebase
        .auth()
        .signInWithPopup(provider)
        .then((userCredential) => {
          var user = userCredential.user;
          console.log(user);
          // const userInfo = {
          //   userUID: user.uid,
          //   displayName: user.displayName,
          //   photoUrl: user.photoURL,
          //   status: true,
          // };

          // console.log(this.user === "");

          // this.db.collection("users").add(userInfo);
        })
        .catch((error) => {
          // Handle Errors here.
          var errorCode = error.code;
          console.log(errorCode);
          // ...
        });
    },
  },
  created() {
    if (localStorage.getItem("userUID") !== null) {
      this.$router.push("/users");
    }
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

@media screen and (max-width: 750px) {
  .form-container {
    position: relative;
  }
  .form-container .form {
    position: absolute;
    top: 0;
    margin-top: 10px;
  }
  .form-container .title {
    font-weight: 600;
    font-size: 32px;
  }
  .form-container .button-login {
    height: 32px;
    font-size: 14px;
  }
}

@media screen and (max-width: 450px) {
  .form-container .form {
    width: 300px;
  }
  .form-container .title {
    font-weight: 600;
    font-size: 28px;
  }
  .form-container .button-login {
    height: 30px;
    font-size: 14px;
    margin-top: 0px;
  }
  .form-container .button-login:hover {
    background: black;
    color: white;
  }
  .button-google {
    margin-left: 0%;
  }
}
@media screen and (max-width: 300px) {
  .form-container .form {
    width: 250px;
  }
  .button-google {
    margin-left: -24px;
  }
}
</style>
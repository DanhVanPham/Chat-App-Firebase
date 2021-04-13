<template>
  <div class="form-container">
    <form class="form">
      <h1 class="title">Profile Account</h1>
      <div class="show-image">
        <img :src="this.photoUrl" alt="image-user" />
      </div>
      <InputField
        :type="`text`"
        :name="`input name`"
        :label="`Name`"
        :icon="`fa fa-user`"
        :placeHolder="`Name`"
        :value="name"
        @input="name = $event"
      />
      <div class="input-container">
        <div class="input-icon"><i class="fa fa-picture-o"></i></div>
        <div class="input-field">
          <h5>Image</h5>
          <input
            type="file"
            placeholder="Image"
            name="input gmail"
            class="input gmail"
            @change="changeAvatar"
          />
        </div>
      </div>
      <button
        type="submit"
        class="button-login"
        @click.prevent="uploadAvatar()"
      >
        Save change
      </button>
      <div style="margin-top: 25px" class="pagination" />
      <p class="link-create">Back to chat: <a :href="`/users`">Go back</a></p>
    </form>
  </div>
</template>

<script>
import InputField from "../components/InputField/InputField.vue";
import firebase from "../services/firebase";
import Vue from "vue";
export default {
  components: { InputField },
  data: () => {
    return {
      photoUrl: localStorage.getItem("photoUrl"),
      name: localStorage.getItem("displayName"),
      id: localStorage.getItem("userUID"),
      newPhoto: "",
      firebaseDocId: localStorage.getItem("FirebaseDocumentId"),
    };
  },
  methods: {
    changeAvatar(event) {
      if (event.target.files && event.target.files[0]) {
        const fileType = event.target.files[0].type.toString();
        if (fileType.indexOf("image") != 0) {
          Vue.toasted.show("Please choose an image").goAway(1500);
          return;
        }
        this.newPhoto = event.target.files[0];
        this.photoUrl = URL.createObjectURL(event.target.files[0]);
      } else {
        Vue.toasted.show("Something went wrong!").goAway(1500);
      }
    },
    uploadAvatar() {
      if (this.newPhoto) {
        const upload = firebase
          .storage()
          .ref()
          .child(this.id)
          .put(this.newPhoto);
        // we need download url
        upload.on(
          "state_changed",
          null,
          (err) => {
            console.log("error", err.message);
          },
          () => {
            upload.snapshot.ref.getDownloadURL().then((url) => {
              console.log(url);
              this.updateUserInfo(true, url);
            });
          }
        );
      } else {
        // if user only wants to update his/her name and desc
        this.updateUserInfo(false, null);
      }
    },
    updateUserInfo(isUrlPresent, downloadURL) {
      let newInfo = {};
      console.log(this.name);
      if (isUrlPresent) {
        newInfo = {
          name: this.name,
          URL: downloadURL,
        };
      } else {
        newInfo = {
          name: this.name,
        };
      }
      firebase
        .firestore()
        .collection("users")
        .doc(this.firebaseDocId)
        .update(newInfo)
        .then(() => {
          localStorage.setItem("displayName", this.name);
          Vue.toasted.show("Profile updated").goAway(1500);
          if (isUrlPresent) {
            localStorage.setItem("photoUrl", downloadURL);
          }
          this.$router.push("/users");
        });
    },
  },
  created() {
    if (localStorage.getItem("userUID") === null) {
      this.$router.push("/login");
    }
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
.form-container .form .title {
  text-align: center;
  font-family: "Arsenal", sans-serif;
  font-weight: 800;
  font-size: 40px;
  color: #6c63ff;
}
.form-container .form .show-image {
  width: 150px;
  height: 150px;
  display: block;
  margin: 0 auto;
  border: 1px solid #3ac9f5;
}
.form-container .form .show-image img {
  width: 150px;
  height: 150px;
  position: relative;
  padding: 10px;
}
.form-container .form .button-login {
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
.input-container {
  position: relative;
  display: grid;
  grid-auto-columns: 7% 93%;
  margin: 25px 0;
  padding: 5px 0;
  border-bottom: 2px solid #e4e1e1;
}
.input-icon {
  grid-column: 1;
  justify-content: center;
  align-items: center;
}
.input-field {
  position: relative;
  grid-column: 2;
}
.input-field h5 {
  margin-top: 1px;
  font-family: "Arsenal", sans-serif;
}
.input-field .input {
  width: 88%;
  height: 36px;
  border: none;
  border-radius: 18px;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  outline: none;
  padding-left: 10px;
  transition: 0.5s ease-in-out;
  margin-bottom: 10px;
}
.input-field .input:focus {
  width: 92%;
  box-shadow: 0px 2px 8px rgba(13, 227, 255, 0.952);
}
.input-field .input ::placeholder {
  padding-left: 16px;
}
@media screen and (max-width: 750px) {
  .input-field h5 {
    margin-top: 0px;
    font-size: 17px;
  }
  .input-field .input {
    height: 30px;
    margin-bottom: 8px;
  }
}
</style>
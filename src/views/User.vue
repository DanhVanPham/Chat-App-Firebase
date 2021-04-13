<template>
  <div class="list-user-container">
    <div class="current-user">
      <div class="header-form-user">
        <div class="image-my-self">
          <router-link to="/profile"
            ><img
              :src="this.currentUserPhotoUrl"
              alt="avatar"
              class="avatar-my-self"
          /></router-link>
        </div>
        <div class="display-name-my-self">
          <div class="name-my-self">{{ this.currentUserName }}</div>
          <div class="status-my-self">Active now</div>
        </div>
        <div class="logout">
          <button class="button-logout" @click="signOut()">Logout</button>
        </div>
      </div>
      <div style="margin-top: 25px" class="pagination" />
      <div class="form-list-users">
        <div class="search-bar-user">
          <div class="input-icon"><i class="fa fa-search"></i></div>
          <div class="input-field">
            <input
              type="text"
              placeholder="Enter name to search..."
              name="search-user"
              class="search-user"
            />
          </div>
        </div>
        <div class="list-users">
          <div
            v-for="user in this.searchUser"
            :key="user.userId"
            v-show="currentUserId !== user.userId"
          >
            <div class="user-container" v-on:click="letChat(user)">
              <div class="current-user-image">
                <img :src="user.photoUrl" alt="avatar-my-self" />
              </div>
              <div class="display-name-user">
                <div class="name-user">{{ user.displayName }}</div>
                <div class="message-user">
                  {{ user.currentMessage }}
                </div>
              </div>
              <div class="current-user-status">
                <div :class="user.status"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="content" v-if="this.currentPeerUser">
      <Chat :currentPeerUser="currentPeerUser" />
    </div>
    <div class="content" v-else>
      <div class="new-image">
        <img
          :src="this.currentUserPhotoUrl"
          alt="avatar"
          class="avatar-my-self"
        />
      </div>
      <div class="welcome">
        <h2>Welcome {{ currentUserName }},</h2>
        <h3>Let's spread love</h3>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
// import CurrentUser from "../components/CurrentUser/CurrentUser.vue";
import Chat from "../views/Chat.vue";
import Vue from "vue";
export default {
  components: { Chat },
  data: () => {
    return {
      db: firebase.firestore(),
      user: firebase.auth().currentUser,
      currentUserName: localStorage.getItem("displayName"),
      currentUserPhotoUrl: localStorage.getItem("photoUrl"),
      currentUserId: localStorage.getItem("userUID"),
      currentUserEmail: localStorage.getItem("email"),
      currentPeerUser: null,
      username: "",
      password: "",
      findUser: "",
      searchUser: [],
    };
  },
  methods: {
    letChat(evt) {
      this.currentPeerUser = evt;
    },
    signOut() {
      console.log(this.findUser);
      firebase
        .auth()
        .signOut()
        .then(async () => {
          await this.db
            .collection("users")
            .doc(localStorage.getItem("FirebaseDocumentId"))
            .update({
              status: false,
            })
            .then(() => {
              localStorage.clear();
              if (this.$route.name !== "/login") {
                this.$router.push("/login").catch(() => {});
              }
              Vue.toasted.show("Logout successfully.").goAway(2000);
            })
            .catch((error) => {
              console.log("Error getting documents: ", error);
              Vue.toasted.show("Logout failed!").goAway(2000);
            });
        })
        .catch((error) => {
          console.log(error.code);
          console.log(error);
        });
    },
    async getUserList() {
      await this.db.collection("users").onSnapshot((Snapshot) => {
        if (Snapshot.docChanges().length > 0) {
          Snapshot.docChanges().forEach((res, index) => {
            let inde = this.searchUser.findIndex(
              (user) => user.userId === res.doc.data().id
            );
            if (inde !== -1) {
              this.searchUser[inde].status = res.doc.data().status
                ? "active"
                : "de-active";
              console.log(this.searchUser);
            } else {
              this.searchUser.push({
                key: index,
                documentKey: res.doc.id,
                userId: res.doc.data().id,
                displayName: res.doc.data().name,
                photoUrl: res.doc.data().URL,
                description: res.doc.data().description,
                status: res.doc.data().status ? "active" : "de-active",
              });
            }
            console.log(inde);
          });
        }
      });
    },
  },
  created() {
    if (localStorage.getItem("userUID") === null) {
      this.$router.push("/login");
    }
    this.getUserList();
  },
};
</script>

<style scoped>
.list-user-container {
  background: rgb(252, 251, 251);
  border-radius: 25px;
  width: 80vw;
  min-height: 90vh;
  box-shadow: 0 19px 38px rgba(0, 0, 0, 0.3), 0 15px 12px rgba(0, 0, 0, 0.22);
  position: absolute;
  top: 28%;
  left: 50%;
  transform: translate(-50%, -28%);
  display: flex;
  flex-direction: row;
}
.list-user-container .current-user {
  width: 25vw;
  padding: 20px 20px;
}
.list-user-container .content {
  border-left: 1px solid rgb(211, 210, 208);
  width: 55vw;
}
.list-user-container .current-user .header-form-user {
  display: flex;
  justify-content: space-between;
}

.list-user-container .current-user .header-form-user .image-my-self {
  cursor: pointer;
}

.list-user-container
  .current-user
  .header-form-user
  .image-my-self
  img.avatar-my-self {
  border-radius: 50%;
  width: 50px;
  height: 50px;
}

.list-user-container
  .current-user
  .header-form-user
  .display-name-my-self
  .name-my-self {
  font-weight: 600;
  font-size: 20px;
  letter-spacing: 1.5px;
  text-align: center;
  font-family: "Arsenal", sans-serif;
}

.list-user-container .current-user .header-form-user .logout button {
  border-radius: 6px;
  padding-top: 2px;
  padding-bottom: 2px;
  padding-left: 10px;
  padding-right: 10px;
  margin-top: 10px;
  background-color: black;
  color: white;
  cursor: pointer;
  border: none;
  outline: none;
}

.content .new-image {
  display: block;
  margin: 0 auto;
  text-align: center;
  margin-top: 10%;
}

.content .new-image .avatar-my-self {
  border-radius: 50%;
  width: 200px;
  height: 200px;
}

.content .welcome {
  display: block;
  margin: 0 auto;
  justify-content: center;
  text-align: center;
  margin-top: 30px;
}

.list-user-container .current-user .header-form-user .logout button:hover {
  background-color: #6c63ff;
  outline: none;
}

.pagination {
  height: 1px;
  width: 100%;
  background-color: rgb(187, 179, 179);
}
.search-bar-user {
  display: flex;
  flex-direction: row;
  margin-top: 20px;
}
.search-bar-user .input-field {
  width: 96%;
  margin-left: 4px;
}
.search-bar-user .input-field input {
  width: 100%;
  height: 36px;
  border-radius: 4px;
  border: solid 1px rgb(214, 211, 211);
  outline: none;
  padding-left: 10px;
  transition: 0.5s ease-in-out;
  margin-bottom: 10px;
}
.search-bar-user .input-field input:focus {
  box-shadow: 0px 2px 8px rgba(13, 227, 255, 0.952);
}
.list-users {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
}
.user-container {
  display: flex;
  flex-direction: row;
  margin-bottom: 14px;
  cursor: pointer;
}
.user-container .current-user-image img {
  border-radius: 50%;
  width: 38px;
  height: 36px;
}
.user-container .display-name-user {
  margin-left: 12px;
  width: 50%;
}
.user-container .display-name-user .name-user {
  font-weight: 700;
  font-size: 16px;
  width: 200px;
  margin: auto;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.current-user-status {
  width: 30%;
}
.current-user-status .active {
  float: right;
  margin-top: 11px;
  margin-right: 5px;
  width: 6px;
  height: 6px;
  background-color: green;
  border-radius: 50%;
}
.current-user-status .de-active {
  float: right;
  margin-top: 11px;
  margin-right: 5px;
  width: 6px;
  height: 6px;
  background-color: rgb(187, 186, 186);
  border-radius: 50%;
}
@media screen and (max-width: 895px) {
  .display-name-my-self .status-my-self {
    display: none;
  }
  .name-my-self {
    padding-top: 10px;
    width: 50px;
    margin: auto;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
@media screen and (max-width: 815px) {
  .user-container .display-name-user .name-user {
    font-weight: 600;
    font-size: 14px;
    width: 100px;
    margin-top: 4px;
  }
}
@media screen and (max-width: 760px) {
  .list-user-container {
    background: rgb(252, 251, 251);
    width: 100vw;
    min-height: 100vh;
    border-radius: 0px;
    box-shadow: 0 19px 38px rgba(0, 0, 0, 0.3), 0 15px 12px rgba(0, 0, 0, 0.22);
    position: absolute;
    top: 28%;
    left: 50%;
    transform: translate(-50%, -28%);
    display: flex;
    flex-direction: row;
  }
  .list-user-container .current-user {
    width: 26vw;
    padding: 20px 20px;
  }
  .list-user-container .content {
    border-left: 1px solid rgb(211, 210, 208);
    width: 74vw;
  }
  .user-container .display-name-user .name-user {
    font-size: 13px;
    width: 70px;
    margin-top: 4px;
  }
  .name-my-self {
    display: none;
  }
}
@media screen and (max-width: 644px) {
  .user-container .display-name-user .name-user {
    width: 40px;
  }
}
@media screen and (max-width: 540px) {
  .list-user-container .current-user .header-form-user {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .image-my-self {
    text-align: center;
  }
  .logout {
    text-align: center;
  }

  .list-user-container .current-user .header-form-user .logout button {
    border-radius: 6px;
    padding-top: 1px;
    padding-bottom: 1px;
    padding-left: 4px;
    padding-right: 4px;
    margin-top: 8px;
    font-size: 14px;
  }
  .search-bar-user {
    display: none;
  }
}

@media screen and (max-width: 460px) {
  .list-user-container .current-user {
    width: 20vw;
  }
  .list-user-container .content {
    width: 80vw;
  }
  .user-container .display-name-user .name-user {
    display: none;
  }
  .current-user-status {
    width: 30%;
  }
  .current-user-status .active {
    margin-top: 16px;
    margin-left: -5px;
  }
  .current-user-status .de-active {
    margin-top: 16px;
    margin-left: -5px;
  }
  .pagination {
    width: 110%;
  }
  .content .new-image .avatar-my-self {
    width: 150px;
    height: 150px;
  }

  .content .welcome {
    margin-top: 40px;
  }
  .content .welcome h2 {
    font-size: 26px;
  }
  .content .welcome h3 {
    font-size: 24px;
  }
}
@media screen and (max-width: 360px) {
  .list-user-container .current-user {
    width: 14vw;
  }
  .list-user-container .content {
    width: 86vw;
  }
  .current-user-status {
    display: none;
  }

  .list-user-container
    .current-user
    .header-form-user
    .image-my-self
    img.avatar-my-self {
    width: 30px;
    height: 30px;
    margin-left: -10px;
  }

  .list-user-container .current-user .header-form-user .logout button {
    border-radius: 6px;
    padding-top: 1px;
    padding-bottom: 1px;
    padding-left: 0px;
    padding-right: 0px;
    margin-top: 10px;
    margin-left: -10px;
    font-size: 10px;
  }
  .user-container .current-user-image img {
    width: 30px;
    height: 30px;
    margin-left: -10px;
  }
}
</style>
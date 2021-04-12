<template>
  <div class="chat-box">
    <div class="chat-box-header">
      <img
        src="https://s2.linkimage.com/images/062/62200/preview_73331.jpg"
        alt="user"
        class="avatar"
      />
      <h6>Room for public</h6>
      <div class="sign-out" @click="signOut()">
        <i class="fa fa-sign-out" aria-hidden="true"></i>Log out
      </div>
    </div>
    <div class="chat-box-message">
      <MessageList :chatMessages="messages"></MessageList>
      <div ref="scrollable"></div>
    </div>
    <div>
      <form class="chat-box-input">
        <div class="input-field">
          <input
            type="text"
            placeholder="Input messages..."
            name="message"
            class="input message"
            v-model="message"
            @keydown.enter="sendMessage($event)"
          />
        </div>
        <button
          class="icon"
          :disabled="!this.message"
          @click="sendMessage($event)"
        >
          <img src="../assets/send.png" alt="Send" />
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import MessageList from "../components/MessageList/MessageList.vue";
import firebase from "firebase";
export default {
  components: { MessageList },
  data: () => ({
    user: firebase.auth().currentUser,
    messages: [],
    message: "",
    db: firebase.firestore(),
  }),
  methods: {
    signOut() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          if (this.$route.name !== "/login") {
            this.$router.push("/login").catch(() => {});
          }
        })
        .catch((error) => {
          console.log(error.code);
          console.log(error);
        });
    },
    async sendMessage(event) {
      event.preventDefault();
      console.log(this.message);
      const messageInfomation = {
        userUID: this.user.uid,
        displayName: this.user.displayName,
        photoUrl: this.user.photoURL,
        text: this.message,
        createAt: Date.now(),
      };
      console.log(messageInfomation);
      await this.db.collection("messages").add(messageInfomation);
      this.message = "";
      this.$refs["scrollable"].scrollIntoView({ behavior: "smooth" });
    },
  },
  mounted() {
    this.db
      .collection("messages")
      .orderBy("createAt")
      .onSnapshot((querySnap) => {
        this.messages = querySnap.docs.map((doc) => doc.data());
      });
  },
};
</script>

<style scoped>
.chat-box {
  width: 800px;
  margin: 0 auto;
  background: rgb(252, 251, 251);
  margin-top: 10px;
  border-radius: 32px;
  border-bottom-right-radius: 16px;
  border-bottom-left-radius: 16px;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}
.chat-box-header {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  height: 10vh;
  border-bottom: 1px solid #dee1e2;
  box-sizing: border-box;
}
.chat-box-header .avatar {
  width: 20%;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  margin-left: 10px;
  margin-right: 10px;
}

.chat-box-header .sign-out {
  margin-left: 62%;
  background: rgba(0, 222, 252, 0.952);
  color: white;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-right: 5px;
  padding-left: 5px;
  border-radius: 32px;
  cursor: pointer;
}

.chat-box-header .sign-out:hover {
  background: rgba(255, 255, 255, 0.952);
  color: black;
}

.chat-box-header h6 {
  font-size: 20px;
  margin-left: 5px;
}

.chat-box-message {
  height: 80vh;
  overflow: auto;
}

.chat-box-input {
  height: 8vh;
  align-items: center;
  background-color: rgb(216, 220, 226);
  border-bottom-right-radius: 16px;
  border-bottom-left-radius: 16px;
}

.input-field {
  position: relative;
  width: 91%;
  float: left;
}

.input-field .input {
  width: 100%;
  height: 36px;
  border: none;
  border-radius: 18px;
  box-shadow: 0px 8px 15px rgba(2, 61, 255, 0.1);
  outline: none;
  padding-left: 10px;
  transition: 0.5s ease-in-out;
  margin: 10px;
}
.input-field .input:focus {
  box-shadow: 0px 2px 8px rgba(13, 227, 255, 0.952);
}
.input-field .input ::placeholder {
  padding-left: 16px;
}

.icon {
  margin-left: 26px;
  margin-top: 8px;
  width: 40px;
  box-sizing: border-box;
  text-align: center;
  cursor: pointer;
  display: inline-block;
  vertical-align: middle;
  height: 36px;
  border: none;
  background-color: rgb(216, 220, 226);
}

.icon img {
  display: block;
  width: 24px;
  height: 24px;
  margin: 0 auto;
  transition: 0.5s ease-in-out;
}

.icon img:hover {
  width: 28px;
  height: 28px;
}
.chat-box-message::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #f5f5f5;
}

.chat-box-message::-webkit-scrollbar {
  width: 10px;
  background-color: #f5f5f5;
}

.chat-box-message::-webkit-scrollbar-thumb {
  background-color: #0ae;
  background-image: -webkit-gradient(
    linear,
    0 0,
    0 100%,
    color-stop(0.5, rgba(255, 255, 255, 0.2)),
    color-stop(0.5, transparent),
    to(transparent)
  );
}
</style>
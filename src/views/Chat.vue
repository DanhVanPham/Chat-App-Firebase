<template>
  <div class="chat-box">
    <div class="chat-box-header">
      <img :src="this.currentPeerUser.photoUrl" alt="user" class="avatar" />
      <h6>{{ this.currentPeerUser.displayName }}</h6>
    </div>
    <div class="chat-box-message">
      <MessageList
        :chatMessages="this.listMessage"
        :currentPeerUser="currentPeerUser"
      ></MessageList>
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
import firebase from "../services/firebase";
import moment from "moment";

export default {
  components: { MessageList },
  props: ["currentPeerUser"],
  data: function () {
    return {
      messages: [],
      message: "",
      db: firebase.firestore(),
      currentUserName: localStorage.getItem("displayName"),
      currentUserPhotoUrl: localStorage.getItem("photoUrl"),
      currentUserId: localStorage.getItem("userUID"),
      currentUserEmail: localStorage.getItem("email"),
      listMessage: [],
      groupChatId: null,
      currentUserPeerId: this.$route.params.id,
    };
  },
  updated: function () {
    this.$refs["scrollable"].scrollIntoView({ behavior: "smooth" });
  },
  watch: {
    currentPeerUser: function (newVal, oldVal) {
      if (newVal != oldVal) {
        this.listMessage = [];
        this.getMessages();
        // this.sortByTimeStamp();
        this.$refs["scrollable"].scrollIntoView({ behavior: "smooth" });
      }
    },
  },
  methods: {
    signOut() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          localStorage.clear();
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
      const timeStamp = moment().valueOf().toString();
      var date = new Date();
      const messageInfomation = {
        id: timeStamp,
        idFrom: localStorage.getItem("userUID"),
        idTo: this.currentPeerUser.userId,
        photoUrl: localStorage.getItem("photoUrl"),
        text: this.message.trim(),
        timeStamp: timeStamp,
        createAt:
          [date.getMonth() + 1, date.getDate(), date.getFullYear()].join("/") +
          " " +
          [date.getHours(), date.getMinutes(), date.getSeconds()].join(":"),
      };
      var groupChatId = `${localStorage.getItem("userUID")} + ${
        this.currentPeerUser.userId
      }`;
      this.db
        .collection("messages")
        .doc(groupChatId)
        .collection(groupChatId)
        .doc(timeStamp)
        .set(messageInfomation)
        .then(() => {
          this.message = "";
          this.getMessages();
        });
      this.$refs["scrollable"].scrollIntoView({ behavior: "smooth" });
    },
    async getMessages() {
      this.listMessage = [];
      let groupChatId = `${localStorage.getItem("userUID")} + ${
        this.currentPeerUser.userId
      }`;
      this.db
        .collection("messages")
        .doc(groupChatId)
        .collection(groupChatId)
        .onSnapshot((Snapshot) => {
          if (Snapshot.docChanges().length > 0) {
            Snapshot.docChanges().forEach((res) => {
              console.log(res.doc.data());
              this.listMessage.some(
                (message) => message.timeStamp === res.doc.data().timeStamp
              )
                ? ""
                : this.listMessage.push(res.doc.data());
              this.listMessage.sort((itemA, itemB) => {
                return itemA.timeStamp - itemB.timeStamp;
              });
            });
          } else {
            // console.log("call cmng 1");
            this.groupChatId = `${this.currentUserId} + ${this.currentPeerUser.userId}`;
            this.db
              .collection("messages")
              .doc(this.groupChatId)
              .collection(this.groupChatId)
              .onSnapshot((Snapshot) => {
                console.log(Snapshot.docChanges());
                Snapshot.docChanges().forEach((res) => {
                  console.log("res", res.doc.data());
                  if (res.type === "added") {
                    this.listMessage.some(
                      (message) =>
                        message.timeStamp === res.doc.data().timeStamp
                    )
                      ? ""
                      : this.listMessage.push(res.doc.data());
                    this.listMessage.sort((itemA, itemB) => {
                      return itemA.timeStamp - itemB.timeStamp;
                    });
                  }
                });
              });
          }
        });
      groupChatId = `${this.currentPeerUser.userId} + ${localStorage.getItem(
        "userUID"
      )}`;
      this.db
        .collection("messages")
        .doc(groupChatId)
        .collection(groupChatId)
        .onSnapshot((Snapshot) => {
          if (Snapshot.docChanges().length > 0) {
            this.groupChatId = groupChatId;
            console.log(Snapshot.docChanges());
            Snapshot.docChanges().forEach((res) => {
              this.listMessage.some(
                (message) => message.timeStamp === res.doc.data().timeStamp
              )
                ? ""
                : this.listMessage.push(res.doc.data());
              this.listMessage.sort((itemA, itemB) => {
                return itemA.timeStamp - itemB.timeStamp;
              });
            });
          }
        });
      this.$refs["scrollable"].scrollIntoView({ behavior: "smooth" });
    },
  },
  mounted() {
    this.listMessage = [];
    this.getMessages();
  },
  created() {
    if (localStorage.getItem("userUID") === null) {
      this.$router.push("/login");
    }
  },
};
</script>

<style scoped>
.chat-box {
  /* width: 800px; */
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

.chat-box-header h6 {
  font-size: 20px;
  margin-left: 5px;
}

.chat-box-message {
  height: 71.5vh;
  overflow: auto;
}

.chat-box-input {
  height: 8vh;
  align-items: center;
  background-color: rgb(216, 220, 226);
  border-bottom-right-radius: 16px;
}

.input-field {
  position: relative;
  width: 90%;
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
  width: 8px;
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

@media screen and (max-width: 1201px) {
  .input-field {
    width: 88%;
  }
}

@media screen and (max-width: 1001px) {
  .input-field {
    width: 86%;
  }
}

@media screen and (max-width: 860px) {
  .input-field {
    width: 84%;
  }
  .icon {
    margin-left: 18px;
    margin-top: 12px;
    width: 30px;
    height: 30px;
  }

  .icon img {
    width: 20px;
    height: 20px;
  }

  .icon img:hover {
    width: 22px;
    height: 22px;
  }
  .chat-box-message::-webkit-scrollbar {
    width: 6px;
  }
}

@media screen and (max-width: 760px) {
  .chat-box {
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

  .chat-box-header h6 {
    font-size: 20px;
    margin-left: 5px;
  }

  .chat-box-message {
    height: 80vh;
    overflow: auto;
  }

  .chat-box-input {
    height: 8.5vh;
    align-items: center;
    background-color: rgb(216, 220, 226);
    border-radius: 0px;
  }
  .input-field {
    width: 88%;
  }
}

@media screen and (max-width: 550px) {
  .input-field {
    width: 84%;
  }
  .icon {
    margin-left: 16px;
  }

  .icon img {
    width: 20px;
    height: 20px;
  }

  .icon img:hover {
    width: 22px;
    height: 22px;
  }
}

@media screen and (max-width: 460px) {
  .chat-box-header h6 {
    font-size: 17px;
    margin-left: 5px;
  }
  .input-field {
    width: 82%;
  }
  .input-field .input {
    height: 28px;
  }
  .icon {
    margin-top: 8px;
  }

  .icon img {
    width: 18px;
    height: 18px;
  }
  .icon img:hover {
    width: 20px;
    height: 20px;
  }
}
@media screen and (max-width: 350px) {
  .input-field {
    width: 80%;
  }
}
@media screen and (max-width: 320px) {
  .input-field {
    width: 72%;
  }
}
</style>
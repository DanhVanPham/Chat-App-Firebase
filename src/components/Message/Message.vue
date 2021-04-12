<template>
  <div class="message-wrapper">
    <div class="message left" v-if="this.user.uid !== message.userUID">
      <img :src="message.photoUrl" width="30" height="30" alt="user" />
      <div class="display">
        <div class="display-name left">
          {{ this.message.displayName }}
        </div>
        <div class="text-wrapper left">
          {{ this.message.text }}
        </div>
      </div>
    </div>
    <div class="message right" v-else>
      <img :src="message.photoUrl" width="30" height="30" alt="user" />
      <div class="display">
        <div class="display-name right">
          {{ this.message.displayName }}
        </div>
        <div class="text-wrapper right">
          {{ this.message.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
export default {
  props: ["message"],
  data: () => {
    return {
      user: firebase.auth().currentUser,
    };
  },
};
</script>

<style scoped>
.message-wrapper {
  font-family: "Arsenal", sans-serif;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 10px;
  display: block;
}

.message-wrapper .message {
  display: flex;
  flex-direction: row;
  min-height: 40px;
  width: 80%;
}
.message-wrapper .message.right {
  margin-right: 10px;
  float: right;
  margin-bottom: 10px;
  justify-content: flex-end;
  align-items: flex-start;
}

.message-wrapper .message.left {
  justify-content: flex-start;
  align-items: flex-end;
}

.message-wrapper .message.right img {
  display: none;
}
.message-wrapper .message.left img {
  border-radius: 50%;
}
.display .display-name.left {
  margin-left: 14px;
  color: #a8a9aa;
}
.display .display-name.right {
  /* display: flex;
  justify-content: flex-end;
  color: #a8a9aa;
  margin-right: 14px; */
  display: none;
}
.text-wrapper {
  padding: 6px;
  padding-left: 12px;
}
.text-wrapper.left {
  background: #63676b;
  border-top-right-radius: 32px;
  border-bottom-right-radius: 32px;
  border-top-left-radius: 32px;
  border-bottom-left-radius: 6px;
  color: white;
  margin-left: 10px;
}
.text-wrapper.right {
  background-color: #0084ff;
  color: white;
  border-top-right-radius: 32px;
  border-bottom-right-radius: 6px;
  border-top-left-radius: 32px;
  border-bottom-left-radius: 32px;
}
</style>
<template>
  <div class="messages">
    <Message
      v-for="(message, index) in this.chatMessages"
      :message="message"
      :currentPeerUser="currentPeerUser"
      :key="index"
    />
  </div>
</template>

<script>
import Message from "../Message/Message.vue";
export default {
  props: ["chatMessages", "currentPeerUser"],
  components: { Message },
  created: function () {
    console.log(this.chatMessages);
    // this.chatMessages.sort(function (itemA, itemB) {
    //   return itemA.timeStamp - itemB.timeStamp;
    // });
  },
};
</script>

<style scoped>
.messages {
  box-sizing: border-box;
  overflow: hidden;
}
</style>
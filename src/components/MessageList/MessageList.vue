<template>
  <div class="messages">
    <Message
      v-for="(message, index) in this.chatMessages"
      :message="message"
      :key="index"
    />
  </div>
</template>

<script>
import Message from "../Message/Message.vue";
export default {
  props: ["chatMessages"],
  components: { Message },
};
</script>

<style scoped>
.messages {
  box-sizing: border-box;
  overflow: hidden;
}
</style>
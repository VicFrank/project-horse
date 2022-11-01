<template>
  <div>
    <div class="chat-box mx-auto text-left" ref="chatbox">
      <div v-for="(message, index) of messages" :key="index" class="mt-1">
        <span class="chat-username">{{ message.username }}</span
        >:
        <span class="chat-messsage">{{ message.message }}</span>
      </div>
    </div>
    <div class="mx-auto" style="max-width: 701px">
      <b-form inline @submit="sendChatMessage">
        <b-form-input
          v-model="nextMessage"
          autocomplete="off"
          class="chat-text-box"
        ></b-form-input>
        <b-button type="submit" variant="primary" style="height: 40px"
          >Chat</b-button
        >
      </b-form>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    nextMessage: "",
  }),
  computed: {
    messages() {
      return this.$store.getters.chatMessages;
    },
    username() {
      return this.$store.getters.username;
    },
  },
  methods: {
    sendChatMessage(e) {
      e.preventDefault();

      if (this.nextMessage == "") return;
      this.nextMessage = this.nextMessage.substring(0, 500);

      // send the message using the websocket
      const data = {
        username: this.username,
        message: this.nextMessage,
      };
      this.$store.dispatch("addMessage", data);
      this.$store.dispatch("sendMessage", data);

      const chatBox = this.$refs.chatbox;
      this.$nextTick(() => (chatBox.scrollTop = chatBox.scrollHeight));

      // clear the message
      this.nextMessage = "";
    },
  },
};
</script>

<style scoped>
.chat-box {
  overflow: auto;
  background-color: #2b3341;

  max-width: 700px;
  height: 200px;

  padding: 10px;

  font-size: 18px;
}

.chat-username {
  color: #0b86c4;
}

.chat-message {
  color: #fff;
}

.chat-text-box {
  min-width: 600px;
}
</style>
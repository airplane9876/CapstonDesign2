<template>
  <div>
    <div>
      <h2>Component-defined method:</h2>
      <p>
        This example uses <code>"getMessage()"</code> defined in the component
        and consumes <code>chatMessages</code> that were sent directly to Vuex
      </p>
      <label>If you can see text appear in the box, it worked!</label>
      <button @click="getMessage()">Get Message</button>
      <textarea
        v-model="messageRxd"
        placeholder="[messageRxd] Waiting for you to click the 'Get Message' button..."
        rows="3"
        max-rows="6"
      ></textarea>
      <textarea
        v-model="chatMessages"
        placeholder="[chatMessages] Formatted messages will appear here"
        rows="3"
        max-rows="6"
      ></textarea>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      messageRxd: '',
      testMsg: 'adfasdf',
    }
  },
  computed: mapState(['chatMessages']),
  // mounted() {
  //   this.socket = this.$nuxtSocket({
  //     channel: '/index',
  //     reconnection: false,
  //   })
  // },
  methods: {
    async getMessage() {
      console.log(this.$store.state.chatMessages)
      this.messageRxd = await this.socket.emitP('getMessage')
    },
  },
}
</script>

<style scoped>
.message-rxd-textbox {
  width: 500px;
  height: 500px;
}
</style>

<template>
  <ul>
    <Message :message="message"
     @message-clicked="handleMessageClick" v-for="message in messages" :key="message"></Message>
  </ul>
</template>
<script>
import Message from './Message'
export default {
  name: 'list',
  props: ['messages'],
  components: {
    Message
  },
  methods: {
    handleMessageClick (message) {
      console.log(message)
    }
  }
}
</script>

<template>
  <div id="app">
    <MessageList>
      <p slot="header">
        Awesome header
      </p>
      <Message :message="message"
        @message-clicked="handleMessageClick"
        v-for="message in messages"
        :key="message">
      </Message>
    </MessageList>
    <zh-form></zh-form>
  </div>
</template>

<script>
import MessageList from './components/MessageList'
import ZhForm from './components/Form'
import Message from './components/Message'

export default {
  name: 'App',
  components: {
    MessageList,
    ZhForm,
    Message
  },
  data () {
    return {
      messages: ['Hey john', 'Howdy Paco']
    }
  },
  methods: {
    handleMessageClick (message) {
      console.log(message)
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

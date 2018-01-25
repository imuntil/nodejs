<template>
  <div id="app">
    <MessageList :messages="messages"></MessageList>
    <zh-form></zh-form>
  </div>
</template>

<script>
import MessageList from './components/MessageList'
import ZhForm from './components/Form'

export default {
  name: 'App',
  components: {
    MessageList,
    ZhForm
  },
  data () {
    return {
      messages: ['Hey john', 'Howdy Paco']
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

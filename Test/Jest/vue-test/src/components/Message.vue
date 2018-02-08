<template>
  <li @click="handleClick" class="message">{{ message }}</li>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      required: true,
      validator: message => message.length > 1
    },
    author: {
      type: String,
      default: 'Zhin'
    }
  },
  methods: {
    handleClick () {
      this.$emit('message-clicked', this.message)
    }
  },
  created () {
    // console.log('CREATED!')
    // this.$on('message-clicked', (v) => {
    //   console.log(v)
    // })
  }
}
</script>

<style>

</style>

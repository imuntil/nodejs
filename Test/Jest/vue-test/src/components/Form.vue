<template>
  <div>
    <form action="">
      <input type="text" v-model="inputValue">
      <br>
      <span class="reversed">{{ reversedInput }}</span>
    </form>
  </div>
</template>

<script>
export default {
  props: ['reversed'],
  data: () => ({
    inputValue: ''
  }),
  computed: {
    reversedInput () {
      return this.reversed ?
        this.inputValue.split('').reverse().join('') :
        this.inputValue
    }
  }
}
</script>

<style>

</style>

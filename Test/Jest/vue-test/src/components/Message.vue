<template>
  <li class="message">{{ message }}</li>
</template>

<script>
export default {
  props: ['message'],
  created () {
    console.log('CREATED!')
  }
}
</script>

<style>

</style>

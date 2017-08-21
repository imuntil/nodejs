<template>
  <div>
    <p>the about page</p>
    <a href="javascript:;">{{about}}</a>
  </div>
</template>
<script>
  export default {
    head () {
      return {
        title: 'About'
      }
    },
    data () {
      return {
        about: 'xxx'
      }
    }
  }
</script>
<style scoped>
  p {
    width:100%;
    text-align: center;
    margin:10rem 0;
  }
</style>

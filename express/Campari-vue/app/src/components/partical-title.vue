<template>
  <h3>
    <slot></slot>
  </h3>
</template>
<script>
  export default {}
</script>
<style type="text/scss" lang="scss" scoped>
  h3 {
    width:100%;
    text-align: center;
    position: relative;
    padding-bottom:1rem;
    padding-top:1.2rem;
    font-size:1.1rem;
    font-weight:500;
  &::after {
     content: ' ';
     width:2rem;
     height:.2rem;
     background-color: #dddddd;
     position: absolute;
     bottom:0;
     right:0;
     left:0;
     margin:0 auto;
   }
  }
</style>

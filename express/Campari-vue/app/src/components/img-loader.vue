<template>
  <div>
    <slot></slot>
  </div>
</template>
<script>
  export default {
    props: {
      imgs: {
        type: Array,
        required: true
      }
    }
  }
</script>

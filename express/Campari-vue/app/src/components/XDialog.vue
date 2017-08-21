<template>
  <div class="dialog-wrapper">
    <div class="dialog-box">
      <h3>请输入昵称</h3>
      <input type="text">
      <div class="btn-group">
        <a href="javascript:;">Cancel</a>
        <a href="javascript:;">Save</a>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
  }
</script>
<style type="text/scss" lang="scss" scoped>
  .dialog-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
  }
  .dialog-box {
    width: 88%;
    position: relative;
    margin: 20% auto;
    overflow: hidden;
    h3 {
      font-size:2rem;
      color: #444;
      width: 100%;
      text-align: center;
    }
    input {
      width:90%;
      margin: 1rem auto;
      height: 32px;
      font-size: 1rem;
    }
    .btn-group {
      display: flex;
      justify-content: space-between;
      a {
        padding: .6rem 1.2rem;
        display: block;
      }
    }
  }
</style>


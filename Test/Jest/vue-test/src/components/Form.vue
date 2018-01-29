<template>
  <div>
    <form action="" @submit.prevent="onSubmit(inputValue)">
      <input type="text" v-model="inputValue">
      <br>
      <span class="reversed">{{ reversedInput }}</span>
    </form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  props: ['reversed'],
  data: () => ({
    inputValue: '',
    results: []
  }),
  computed: {
    reversedInput () {
      return this.reversed
        ? this.inputValue
            .split('')
            .reverse()
            .join('')
        : this.inputValue
    }
  },
  methods: {
    onSubmit (v) {
      axios.get('https://jsonplaceholder.typicode.com/posts?q=' + v)
        .then(results => {
          this.results = results.data
        })
    }
  },
  watch: {
    inputValue (v, o) {
      if (v.trim().length && o !== v) {
        console.log(v)
      }
    }
  }
}
</script>

<style>

</style>

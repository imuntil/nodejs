const p = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(false)
      console.log('xxxxx')
      resolve(true)
      console.log('111')
    }, 1000);
  })
}
p().then(data => {
  console.log(data)
}).catch(err => {
  console.log(err)
})
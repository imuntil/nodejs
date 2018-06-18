class A {

  constructor(name) {
    /* 实例属性 */
    this.name = name
  }
  /* 实例方法 */
  say() {
    console.log('lala')
  }

  /* 存取器 */
  get age() {
    return this._age
  }
  set age(value) {
    this._age = value
  }

  /* 私有属性 */
  // _age = 1
  /* 私有方法 */
  _say() {
    console.log('private say')
  }

  /* 静态属性 */
  // static value = 20
  /* 静态方法 */
  static speak() {
    console.log('this is A')
  }

}

console.log(A.value)
A.speak()

const v = new A('vv')

console.log(v.name)
console.log(v.age)
v.say()
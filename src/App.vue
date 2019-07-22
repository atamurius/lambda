<template>
  <div>
    <ol>
      <li v-for="[e, h] of history" :key="e">
        <div class="row"><Expr :value="e" :app="h" history="true"/></div>
      </li>
      <li>
        <div class="row"><Expr :value="expression" :app="highlighted"/></div>
      </li>
    </ol>    
    <button @click="next" :disabled="highlighted">Next step</button>
  </div>
</template>

<script>
import Expr from './components/Expr.vue'
import {parse, findFold, runFold} from './lambda'

export default {
  name: "App",
  data: () => ({
    expression: parse('(\\x.\\y.(x y)) A B'),
    history: [],
    highlighted: null,
  }),
  components: {
    Expr
  },
  methods: {
    next() {
      if (this.highlighted) {
        this.history.push([
          this.expression, 
          this.highlighted])
        this.expression = runFold(
          this.expression, 
          this.highlighted)
        this.highlighted = null
      }
      else {
        this.highlighted = findFold(this.expression)
        window.setTimeout(() => this.next(), 1000)
      }
    }
  }
}
</script>

<style scoped>
.row {
  display: flex;
  padding: 2px 3px;
}
button {
  margin-left: 1em;
  font-size: 120%;
}
</style>

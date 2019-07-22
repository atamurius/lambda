<template>
  <span 
    :class="['block', type, selected && 'selected', history && 'history']" 
    :title="stringify(value)"
  >
    <template v-if="type === 'application'">
      <Expr :value="value.function" :app="app"/>
      <Expr :value="value.argument" :app="app"/>
    </template>
    <template v-else-if="type === 'abstraction'">
      <Expr :value="value.body" :app="app"/>
      <span class="var block">{{ value.variable }}</span>
    </template>
    <template v-else-if="type === 'symbol'">
      {{ value.name }}
    </template>
    <template v-else>
      Unexpected value: {{ value }}
    </template>
  </span>
</template>

<style scoped>
.delim {
  font-size: 8pt;
  color: rgba(0,0,0,.4)
}
.block {
  font-size: 16pt;
  color: rgba(0,0,0,.8);
  border-radius: 8px;
  margin: 4px 3px;
  padding: 2px 7px;
  display: flex;
  align-items: center;
  font-family: sans-serif;
  box-shadow: 0 0 2px rgba(0,0,0,.3);
  position: relative;
}
.block:hover {
  cursor: default;
  box-shadow: 0 0 3px rgba(0,0,0,.5);
}
.application {
  background: rgb(255, 224, 178);
}
.application.selected {
  background: rgb(255, 250, 178);
  box-shadow: 0 0 3px rgba(0,0,0,.5);
}
.application.selected > .abstraction:first-child > .var {
  background: yellow;
  box-shadow: 0 0 3px rgba(0,0,0,.5);
}
.application.selected:not(.history) > .abstraction:first-child {
  animation: merge 1s ease-out;
}
@keyframes merge {
  from { margin-right: .6em }
  to   { margin-right: -1em }
}
.abstraction {
  background: rgb(187, 222, 251);
  margin-right: .6em;
}
.var {
  background: rgb(220, 237, 200);
  font-size: 80%;
  border-radius: 50%;
  width: .6em;
  display: block;
  margin-right: -1em;
  text-align: center;
  color: rgba(0,0,0,.4)
}
.symbol {
  background: rgb(209, 196, 233);
}
</style>

<script>
import {stringify} from '../lambda'
export default {
  props: ['value', 'app', 'history'],
  name: "Expr",
  methods: {stringify},
  computed: {
    type() {
      return this.value.constructor.type 
    },
    selected() {
      return this.sel === this.value
    }
  }
}
</script>

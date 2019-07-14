
Vue.component('expr', {
    template: "#expression",
    props: ['expr'],
    methods: { stringify: L.stringify },
})

const vue = new Vue({
  el: "#template",
  data: {
    error: null,
    expression: "(\\x.\\y.x) left right",
    expressions: [],
    predefined: {
    }
  },
  methods: {
    run() {
      let finished = false
      try {
        let last = L.parse(this.expression)
        this.error = null
        this.expressions = [last]
        while (!finished) {
          const next = L.apply(last, this.predefined)
          if (!L.eq(next, last))
            this.expressions.push(next)
          else
            finished = true
          last = next
        }
      }
      catch (err) {
        this.error = err.message
      }
    },
  }
})
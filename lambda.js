const struct = (type, ...args) => {
  const builder = (...values) => ({
    type,
    ...(args.reduce(
      (o, a, i) => ({ ...o, [a]: values[i] }),
      { }
    )),
  })
  builder.type = type;
  builder.is = obj => obj.type === type;
  return builder;
}


const L = {
  app: struct("application", "f", "arg"),
  def: struct("abstraction", "v", "body"),
  sym: struct("symbol", "sym"),

  isStruct(e) {
    return L.app.is(e) || L.def.is(e) || L.sym.is(e)
  },

  stringify(e) {
    switch (e.type) {
      case L.app.type: 
        return `(${L.stringify(e.f)} ${L.stringify(e.arg)})`
      case L.def.type:
        return `λ${e.v}.${L.stringify(e.body)}`
      case L.sym.type:
        return e.sym
      default:
        return `${e}`
    }
  },

  map(e, f, ...args) {
    switch (e.type) {
      case L.app.type:
        return L.app(f(e.f, ...args), f(e.arg, ...args))
      case L.def.type:
        return L.def(e.v, f(e.body, ...args))
      default:
        return e
    }
  },

  eq(a, b) {
    if (!L.isStruct(a))
      return a === b
    else if (a.type !== b.type)
      return false
    else switch (a.type) {
      case L.app.type:
        return L.eq(a.f, b.f) && L.eq(a.arg, b.arg)
      case L.def.type:
        return L.eq(a.v, b.v) && L.eq(a.body, b.body)
      case L.sym.type:
        return a.sym === b.sym
      default:
        return false
    }
  },

  subst(e, sym, value) {
    if (L.sym.is(e) && e.sym === sym) 
      return value;
    else 
      return L.map(e, L.subst, sym, value)
  },

  apply(e, fs) {
    if (L.app.is(e)) {
      const {f, arg} = e
      // lambda application
      if (L.def.is(f))
        return L.subst(f.body, f.v, arg)
      // named application
      if (L.sym.is(f) && fs[f.sym])
        return L.app(fs[f.sym], arg)
    }
    return L.map(e, L.apply, fs)
  },

  // (\\x.x) 5
  parse(text) {
    const ts = text
      .split(/\s+|([()\\\.])|([0-9a-z]+)/)
      .filter(x => x !== "" && x !== undefined)

    const exprs = () => {
      let acc = expr()
      let next
      while (next = expr())
        acc = L.app(acc, next)
      return acc
    }

    const expr = () => {
      if (ts.length == 0) return null
      let token = ts.shift()
      let result
      switch (token) {
        case '\\':
          const v = ts.shift()
          const dot = ts.shift()
          if (dot !== ".")
            throw new Error(`Expected '.' at '\\${v}${dot}'`)
          const body = exprs()
          if (!L.isStruct(body))
            throw new Error(`Expected body at '\\${v}.${body}'`)
          result = L.def(v, body)
          break
        case ')':
          ts.unshift(')')
          result = null
          break
        case '(':
          result = exprs()
          const par = ts.shift()
          if (par !== ")") throw new Error(`Missing ')' at '${par || ""}${ts.join(" ")}'`)
          break
        default:
          result = L.sym(token)
      }
      return result
    }
    const res = exprs()
    if (ts.length > 0)
      throw new Error(`Unexpected '${ts.join(" ")}'`)
    return res
  }
}

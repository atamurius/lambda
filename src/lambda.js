import {struct, copy} from './struct'

export const App = struct("application", "function", "argument")
export const Def = struct("abstraction", "variable", "body")
export const Sym = struct("symbol", "name")


export function stringify(e) {
  switch (e && e.constructor) {
    case App: 
      return `(${stringify(e.function)} ${stringify(e.argument)})`
    case Def:
      return `(λ${e.variable}.${stringify(e.body)})`
    case Sym:
      return e.name
    default:
      return `${e}`
  }
}


function map(e, f, ...args) {
  switch (e && e.constructor) {
    case App: 
      return copy(e, f(e.function, ...args), f(e.argument, ...args))
    case Def:
      return copy(e, e.variable, f(e.body, ...args))
    default:
      return e
  }
}


export function findFold(e) {
  if (e instanceof App && e.function instanceof Def) {
    return e
  }
  else switch (e && e.constructor) {
    case App: 
      return findFold(e.function) || findFold(e.argument)
    case Def:
      return findFold(e.variable) || findFold(e.body)
    default:
      return null
  }
}

function subst(e, name, value) {
  if (e instanceof Sym && e.name === name)
    return value
  else
    return map(e, subst, name, value)
}

export function runFold(e, t) {
  if (e === t) {
    const {function: {variable, body}, argument} = e
    return subst(body, variable, argument)
  }
  else return map(e, runFold, t)
}


export function parse(text) {
  const ts = text
    .split(/\s+|([()\\\.])|([0-9a-z]+)/)
    .filter(x => x !== "" && x !== undefined)

  const exprs = () => {
    let acc = expr()
    let next
    while (next = expr())
      acc = new App(acc, next)
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
        if (!body || !body.constructor)
          throw new Error(`Expected body at '\\${v}.${body}'`)
        result = new Def(v, body)
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
        result = new Sym(token)
    }
    return result
  }
  const res = exprs()
  if (ts.length > 0)
    throw new Error(`Unexpected '${ts.join(" ")}'`)
  return res
}

export function struct(tp, ...fs) {
  return class Struct {
    static type = tp
    static fields = fs

    constructor(...values) {
      if (values.length !== fs.length)
        throw new Error(`Expected ${fs}: ${values}`)
      fs.forEach((field, i) => 
        this[field] = values[i]
      )
    }

    toString() {
      return `(${tp} ${fs.map(f => this[f]).join(" ")})`
    }
  }
}

export function eq(a, b) {
  if (a && b && a.constructor === b.constructor) {
    let same = true
    for (let f in a)
      same &= eq(a[f], b[f])
    return same
  }
  else return a === b
}

export function copy(s, ...fields) {
  let same = true
  s.constructor.fields.forEach((f, i) =>
    same = same && s[f] === fields[i]
  )
  if (same) return s
  else return new s.constructor(...fields)
}

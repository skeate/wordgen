import { Mode, Rule } from './Rule'

export class Merger extends Rule {
  protected defMode: Mode = Mode.Full

  override output() {
    let out = ''
    for (const element of this.elements) {
      if (typeof element === 'string') continue
      if (element.prob instanceof Array) {
        for (let j = 0; j < element.prob.length; j++) {
          const p = (
            element.prob[j] === '...'
              ? (element.prob[--j] as number)
              : element.prob[j]
          ) as number
          const prob = Math.random()
          if (prob > p / this.prob) break
          out += element.field.output()
        }
      } else if (Math.random() < element.prob) {
        out += element.field.output()
      }
    }
    return out
  }
}

import { Rule } from './Rule'

export class Selector extends Rule {
  override output() {
    let prob = Math.random()
    let i = -1
    let element
    while (
      prob > 0 &&
      (element = this.elements[++i]) &&
      typeof element !== 'string'
    ) {
      prob -= element.prob as number
    }
    return element && typeof element === 'object' ? element.field.output() : ''
  }
}

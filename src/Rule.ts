export enum Mode {
  /** Splits the remaining probability amongs unspecified elements (for selection) */
  Split,
  /** Sets probability of any unspecified elements to 100% (for merging) */
  Full,
}

type Element =
  | string
  | {
      field: Outputtable
      prob: number | Array<number | '...'>
    }

interface Outputtable {
  output(): string
}

export abstract class Rule implements Outputtable {
  protected prob = 100
  protected defMode: Mode = Mode.Split
  protected elements: Array<Element>

  constructor(readonly name: string, elements: string) {
    this.elements = [elements]
  }

  abstract output(): string

  findProb() {
    // see if there's a base probability
    const firstElement = this.elements[0]
    if (typeof firstElement === 'string') {
      const prob = firstElement.match(/^\d+/)
      if (prob) {
        this.elements[0] = firstElement.substring(prob[0].length)
        this.prob = parseInt(prob[0], 10)
      }
    }
  }

  parse(sortedNames: Array<string>, allNames: Map<string, Rule>) {
    let totalProb = 0
    let unassignedProb = []
    this.findProb()
    for (const name of sortedNames) {
      let j = 0
      while (j < this.elements.length) {
        const choice = this.elements[j]
        let idx
        if (typeof choice == 'string' && (idx = choice.indexOf(name)) >= 0) {
          // make a space for the found name, and split it up
          if (idx != 0) {
            this.elements.splice(j + 1, 0, '')
            this.elements[j++] = choice.substring(0, idx)
          }
          const element: Element = { field: allNames.get(name)!, prob: 0 }
          // see if there's a probability after the found name
          let rest = choice.substring(idx + name.length)
          let probLength = 0
          const basicProbMatch = rest.match(/^\d+/)
          if (basicProbMatch) {
            element.prob = parseInt(basicProbMatch[0]) / this.prob
            probLength = basicProbMatch[0].length
            totalProb += element.prob
          } else {
            const recurringProbMatch = rest.match(/^{(\d+, ?)*(\d+|\.\.\.)}/)
            if (recurringProbMatch) {
              let prob = recurringProbMatch[0]
              probLength = prob.length
              prob = prob.substring(1, prob.length - 2)
              let probs = prob
                .split(',')
                .map((p) => (p === '...' ? p : parseInt(p.trim(), 10)))
              element.prob = probs
              totalProb += typeof probs[0] === 'number' ? probs[0] : 0
            } else {
              element.prob = 0
              unassignedProb.push(element)
            }
          }
          this.elements[j] = element
          // if there is stuff after the name, add a new element
          const after = idx + name.length + probLength
          if (after < choice.length) {
            this.elements.splice(j + 1, 0, choice.substring(after))
          }
        } else {
          j++
        }
      }
    }

    // parse out regular characters
    for (let i = 0; i < this.elements.length; i++) {
      const element = this.elements[i]
      if (typeof element !== 'string') continue
      const split = element.split(/([^0-9]{.*?}|[^0-9]\d+|[^0-9])/)
      this.elements.splice(i, 1)
      for (const el of split) {
        if (el === '') continue
        let prob: number | Array<number | '...'> = 0
        if (el.length > 1) {
          if (el.match(/^[^0-9]\d+$/)) {
            prob = parseInt(el.substring(1)) / this.prob
          } else {
            let probs = el.substring(2, el.length - 1).split(',')
            prob = probs.map((p) => (p === '...' ? p : parseInt(p, 10)))
          }
        }
        const basicChar: Element = {
          field: {
            output: () => el[0],
          } satisfies Outputtable,
          prob,
        }
        if (typeof prob === 'number' && prob > 0) {
          totalProb += prob
        } else if (
          prob instanceof Array &&
          prob.length > 0 &&
          typeof prob[0] === 'number'
        ) {
          totalProb += prob[0]
        } else {
          unassignedProb.push(basicChar)
        }
        this.elements.splice(i++, 0, basicChar)
      }
    }

    // assign any missing probabilities
    let leftoverProb = (1 - totalProb) / unassignedProb.length
    for (let i = 0; i < unassignedProb.length; i++) {
      unassignedProb[i].prob = this.defMode === Mode.Split ? leftoverProb : 1
    }
  }
}

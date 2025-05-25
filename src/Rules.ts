import { type Rule } from './Rule'
import { Merger } from './Merger'
import { Selector } from './Selector'
import { Mimic } from './Mimic'

export class Rules {
  private selectors: Array<Selector> = []
  private mergers: Array<Merger> = []
  private substitutions: Map<string, string> = new Map()
  private mimics: Array<Mimic> = []
  private out: Merger | null = null
  private names: Map<string, Rule> = new Map()
  private error: string | false = false

  constructor(rules: Array<string>) {
    // categorize rules, parse out names
    for (const rule of rules) {
      // output rule
      if (rule[0] === '>') {
        try {
          this.out = new Merger('', rule.substring(1))
        } catch (e) {
          this.error = 'Invalid output rule format.'
        }
      } else {
        const match = rule.match(/(?<name>.*)(?<type>[=:~<])(?<value>.*)/)
        if (isValidMatch(match)) {
          const { name, type, value } = match.groups
          switch (type) {
            // selector rule
            case '=': {
              const sel = new Selector(name, value)
              this.names.set(name, sel)
              this.selectors.push(sel)
              break
            }
            // merger rule
            case ':': {
              const merger = new Merger(name, value)
              this.names.set(name, merger)
              this.mergers.push(merger)
              break
            }
            // substitution rule
            case '~': {
              this.substitutions.set(name, value)
              break
            }
            // mimic rule
            case '<': {
              const mimic = new Mimic(name, value)
              this.names.set(name, mimic)
              break
            }
          }
        }
      }
    }
    // sort names by length, then parse names in selectors/mergers/output
    const sortedNames = [...this.names.keys()].sort(
      (a, b) => b.length - a.length,
    )
    try {
      for (const sel of this.selectors) {
        sel.parse(sortedNames, this.names)
      }
      for (const merger of this.mergers) {
        merger.parse(sortedNames, this.names)
      }
      for (const mimic of this.mimics) {
        mimic.parse()
      }
      if (this.out) {
        this.out.parse(sortedNames, this.names)
      } else {
        this.error = 'No output rule.'
      }
    } catch (e) {
      if (e instanceof Error) {
        console.error(e.stack)
        this.error = e.message
      } else {
        console.error(e)
        this.error = 'Unknown error occurred'
      }
    }
  }

  output() {
    try {
      if (this.error) {
        throw new Error(this.error)
      }
      if (!this.out) {
        throw new Error('No output rule')
      }
      let out = ''
      for (let i = 0; i < 100; i++) {
        out += this.out.output() + ' '
      }
      for (const [str, rep] of this.substitutions.entries()) {
        const regex = new RegExp(str, 'g')
        out = out.replace(regex, rep)
      }
      return out
    } catch (e) {
      if (e instanceof Error) console.error(e.stack)
      else console.error(e)
      return '<span class="error">' + String(e) + '</span>'
    }
  }
}

function isValidMatch(m: RegExpMatchArray | null): m is RegExpMatchArray & {
  groups: { name: string; type: string; value: string }
} {
  return !!m
}

import { Rule } from './Rule'

/**
 * The `Mimic` class attempts to mimic the style of a given corpus. This can
 * be useful if you have some words already, but the structure is too complex to
 * be described simply using the other available rules. It works by analyzing
 * what follows what and storing that information in weighted trees.
 */
export class Mimic extends Rule {
  private initials: Array<string> = []
  private trees: Map<string, Array<string | null>> = new Map()
  private words: Array<string>

  /**
   * Like the other rules, this should have a name and a list of elements. In
   * this case, the elements are words to imitate. It checks to ensure the
   * correct format (i.e., "[word word word]"), and then parses the list into an
   * array of individual words.
   */
  constructor(readonly name: string, elements: string) {
    if (!elements.match(/^\[([^0-9]+ )*[^0-9]+\]$/)) {
      throw new Error('Invalid mimic list format.')
    }
    super(name, elements)

    this.words = elements.substring(1, elements.length - 1).split(' ')
  }

  /**
   * The parser prepares the trees. The weight is just how many times they are
   * repeated in the list. It also keeps tracking of what initial letters are
   * used, again weighting them by repetition in the list.
   */
  override parse() {
    this.initials = []
    this.trees = new Map()

    for (const word of this.words) {
      this.initials.push(word[0])
      for (let i = 0; i < word.length; i++) {
        if (!this.trees.has(word[i])) {
          this.trees.set(word[i], [])
        }
        const branch = this.trees.get(word[i])!
        if (i === word.length - 1) {
          branch.push(null)
        }
      }
    }
  }

  /**
   * To output, randomly select an initial letter, then randomly follow the tree
   * until null is reached.
   */
  override output() {
    let rand = Math.floor(Math.random() * this.initials.length)
    let next: string | null = this.initials[rand]
    let word = ''
    let branch
    while (next !== null && (branch = this.trees.get(next))) {
      word += next
      rand = Math.floor(Math.random() * branch.length)
      next = branch[rand]
    }
    return word
  }
}

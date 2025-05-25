import { atom, batched } from 'nanostores'
import { Rules } from './Rules'

export const $spec = atom('')

export const $trigger = atom(0)

export const $output = batched([$trigger], (t) => {
  const spec = $spec.get()
  if (t > 0) {
    if (!spec) {
      return 'No rules specified.'
    }
    const unparsedRules = spec.trim().split('\n')
    const generator = new Rules(unparsedRules)
    return generator.output()
  }
  return 'Press Ctrl+Enter to generate.'
})

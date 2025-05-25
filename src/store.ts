import { atom, batched } from 'nanostores'
import { Rules } from './Rules'

export const $spec = atom('')

export const $trigger = atom(0)

$spec.subscribe(console.log)

export const $output = batched([$trigger, $spec], (t) => {
  const spec = $spec.get()
  console.log(spec)
  if (spec) {
    const unparsedRules = spec.trim().split('\n')
    const generator = new Rules(unparsedRules)
    return generator.output()
  }
  return 'Press Ctrl+Enter to generate.'
})

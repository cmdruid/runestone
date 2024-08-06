import { Buff }          from '@cmdcode/buff'
import { encode_LEB128 } from '@/lib/leb.js'
import { lookup_tag }    from './util.js'
import { RuneMessage }   from '@/types.js'

export function encode_runestone (msg : RuneMessage) {
  const { fields, edicts } = msg

  const lebs  : (bigint | number)[] = []
  const bytes : number[] = []

  for (const [ tag, val ] of fields) {
    const int = lookup_tag(tag)
    lebs.push(int)
    lebs.push(val)
  }

  lebs.push(0)

  for (const edict of edicts) {
    const { id, amt, out } = edict
    lebs.push(id.height, id.idx, amt, out)
  }

  for (const leb of lebs) {
    const ints = encode_LEB128(leb)
    bytes.push(...ints)
  }

  return new Buff(bytes)
}

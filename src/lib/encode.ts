import { Buff }          from '@cmdcode/buff'
import { encode_LEB128 } from '@/lib/leb.js'

export function encode_runestone (
  ...values : number[]
) {
  const lebs = []
  for (const int of values) {
    const leb = encode_LEB128(int)
    lebs.push(...leb)
  }
  return Buff.from(lebs)
}

import { Buff, Bytes }   from '@cmdcode/buff'
import { decode_LEB128 } from '@/lib/leb.js'

export function decode_runestone (
  script_bytes : Bytes
) {
  const bytes = Buff.bytes(script_bytes)
  // assert.ok(bytes[0] === 106, 'runestone missing OP_RETURN')
  // assert.ok(bytes[1] === 93,  'runestone missing OP_13 prefix')
  const lebs = [ ...bytes ]
  const ints = []
  while (lebs.length !== 0) {
    const int = decode_LEB128(lebs)
    ints.push(int)
  }
  return ints
}

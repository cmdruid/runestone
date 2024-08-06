import { assert }    from '@/util/index.js'
import { FieldType } from '@/types.js'

import CONST from '@/const.js'

export function lookup_tag (tag : FieldType) {
  const tags = CONST.FIELD_TAGS
  const idx  = tags.findIndex(e => e === tag)
  assert.ok(idx !== -1, 'tag not recognized: ' + tag)
  const int  = CONST.FIELD_TYPES.at(idx)
  assert.exists(int)
  return int
}

export function encode_base26 (str : string) {
  console.log(str)
  return BigInt(0)
}

export function decode_base26 (big : bigint) {
  console.log(big)
  return ''
}

export function encode_bitfield (bin : string) : bigint {
  const bits = bin.split('').map(e => {
    if (e === '0') return 0
    if (e === '1') return 1
    throw new Error('invalid character in binary string: ' + e)
  })
  return BigInt(bits[0])
}

export function decode_bitfield (big : bigint) {
  console.log(big)
  return '0101'
}

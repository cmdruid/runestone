import { assert }    from '@/util/index.js'
import { FieldType } from '@/types.js'

import CONST from '@/const.js'

const { _0n, _2n, _26n } = CONST.BIG

export function lookup_tag (tag : FieldType) {
  const tags = CONST.FIELD_TAGS
  const idx  = tags.findIndex(e => e === tag)
  assert.ok(idx !== -1, 'tag not recognized: ' + tag)
  const int  = CONST.FIELD_TYPES.at(idx)
  assert.exists(int)
  return int
}

export function encode_base26 (str : string) {
  str = str.toUpperCase()
  let big = _0n

  for (const char of str) {
    if (char >= 'A' && char <= 'Z') {
        big = big * _26n + BigInt(char.charCodeAt(0) - 'A'.charCodeAt(0))
    } else {
      throw new Error('Input string contains non-alphabetic characters: ' + str)
    }
  }
  return big
}

export function decode_base26 (big : bigint) {
  let result = ''
  while (big > _0n) {
    const remainder = big % _26n
    const charCode  = Number(remainder) + 'A'.charCodeAt(0)
    result = String.fromCharCode(charCode) + result
    big = big / _26n
  }
  return result || 'A'
}

export function encode_bitfield (bin : string) : bigint {
  let result = _0n
  for (const char of bin) {
    if (char === '0' || char === '1') {
      result = result * _2n + BigInt(Number(char))
    } else {
      throw new Error('Input string contains non-alphabetic characters: ' + bin)
    }
  }
  return result
}

export function decode_bitfield (big : bigint, pad = 32) {
  if (big === _0n) return '0'
  let bin = ''
  while (big > _0n) {
    const remainder = big % _2n
    bin = remainder.toString() + bin
    big = big / _2n
  }
  return bin.padEnd(pad, '0')
}

import CONST from '@/const.js'

const { _0n, _7n, _32n, _n1n } = CONST.BIG

export function encode_LEB128 (
  value : number | bigint
) : number[] {
  if (typeof value === 'number') {
    value = BigInt(value)
  }
  const result : number[] = []
  while (true) {
    const byte = Number(value & 0x7Fn)
    value >>= _7n
    if (
      (value === _0n  && (byte & 0x40) === 0) ||
      (value === _n1n && (byte & 0x40) !== 0)
    ) {
      result.push(byte)
      return result
    }
    result.push(byte | 0x80)
  }
}

export function decode_LEB128 (
  bytes : number[] | Uint8Array
) : bigint {
  let result = _0n
  let shift  = _0n
  for (let i = 0; i < bytes.length; i++) {
    const byte = bytes[i]
    result |= BigInt(byte & 0x7f) << shift
    shift += _7n
    if ((0x80 & byte) === 0) {
      if (shift < _32n && (byte & 0x40) !== 0) {
        return result | (~_0n << shift)
      }
      return result
    }
  }
  throw new Error('byte stream ended abruptly')
}

export default {
  encode : encode_LEB128,
  decode : decode_LEB128
}

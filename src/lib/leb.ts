import CONST from '@/const.js'

const { _0n, _7n, _127n, _128n } = CONST.BIG

// export function encode_LEB128 (
//   value : number | bigint
// ) : number[] {
//   if (typeof value === 'number') {
//     value = BigInt(value)
//   }
//   const result : number[] = []
//   while (true) {
//     const byte = Number(value & 0x7Fn)
//     value >>= _7n
//     if (
//       (value === _0n  && (byte & 0x40) === 0) ||
//       (value === _n1n && (byte & 0x40) !== 0)
//     ) {
//       result.push(byte)
//       return result
//     }
//     result.push(byte | 0x80)
//   }
// }

export function encode_LEB128 (
  value : number | bigint
) : number[] {
  let val = (typeof value === 'number')
    ? BigInt(value)
    : value
  const ret : number[] = []
  while (val > _127n) {
    ret.push(Number((val & _127n) | _128n))
    val >>= _7n
  }
  ret.push(Number((val & _127n)))
  return ret
}

export function decode_LEB128 (
  bytes : number[] | Uint8Array
) : [ val : bigint, idx : number ] {
  let result = _0n,
      shift  = _0n,
      index  = 0
  while (index < bytes.length) {
    const byte = bytes[index]
    index += 1
    result |= BigInt(byte & 0x7f) << shift
    if ((byte & 0x80) === 0) break
    shift += _7n
  }
  return [ result, index ]
}

export function parse_LEB128 (bytes : Uint8Array) : bigint[] {
  const ints : bigint[] = []
  let   idx   = 0
  while (idx < bytes.length) {
    const sub = bytes.subarray(idx)
    const ret = decode_LEB128(sub)
    ints.push(ret[0])
    idx += ret[1]
  }
  return ints
}

export default {
  encode : encode_LEB128,
  decode : decode_LEB128,
  parse  : parse_LEB128
}

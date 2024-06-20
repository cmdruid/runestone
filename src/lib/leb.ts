export function encode_LEB128 (
  value : number
) {
  value |= 0
  const result = []
  while (true) {
    const byte_ = value & 0x7f
    value >>= 7
    if (
      (value === 0  && (byte_ & 0x40) === 0) ||
      (value === -1 && (byte_ & 0x40) !== 0)
    ) {
      result.push(byte_)
      return result
    }
    result.push(byte_ | 0x80)
  }
}

export function decode_LEB128 (
  bytes : number[]
) {
  let result = 0
  let shift  = 0
  while (true) {
    const byte = bytes.shift()
    if (byte === undefined) {
      throw new Error('byte stream ended abruptly')
    }
    result |= (byte & 0x7f) << shift
    shift += 7
    if ((0x80 & byte) === 0) {
      if (shift < 32 && (byte & 0x40) !== 0) {
        return result | (~0 << shift)
      }
      return result
    }
  }
}

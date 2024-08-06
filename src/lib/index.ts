import { decode_runestone } from './decode.js'
import { encode_runestone } from './encode.js'

import LEB128 from './leb.js'

const Runestone = {
  decode : decode_runestone,
  encode : encode_runestone
}

export * from './decode.js'
export * from './encode.js'

export { LEB128, Runestone }

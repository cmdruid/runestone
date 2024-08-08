import { RuneEdict, RuneID, decode_runestone, encode_runestone } from '@cmdcode/runestone'

const id : RuneID = { height : 139, idx : 1 }
const edict : RuneEdict = { id, amt : BigInt(99), out : 1 }

const encoded = encode_runestone({ edicts : [ edict ] })

console.log('encoded:', encoded.hex)

// '008b0101a0cb980102' 2500000n
// 008b0101e30002 99n

const decoded = decode_runestone('008b01016301')

console.log('decoded:')
console.dir(decoded, { depth : null })
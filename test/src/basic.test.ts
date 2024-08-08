import { Test } from 'tape'

import { decode_runestone, encode_runestone } from '@cmdcode/runestone'

const id        = { height : 139, idx : 1 }
const edict     = { id, amt : BigInt(99), out : 1 }
const runedata  = { edicts : [ edict ] }
const runestone = '008b01016301'

const encoded = encode_runestone({ edicts : [ edict ] })
const decoded = decode_runestone(runestone)
const entries = { ...decoded }

export default function (t : Test) {
  t.test('Basic Encoding / Decoding Test', t => {
    t.plan(2)
    t.equal(encoded.hex, runestone,    'encoded runestone matches test vector')
    t.deepEqual(entries, runedata, 'decoded rune data matches test vector')
  })
}

import { Buff, Bytes }  from '@cmdcode/buff'
import { parse_LEB128 } from '@/lib/leb.js'
import { assert }       from '@/util/index.js'

import { decode_base26, decode_bitfield } from './util.js'

import {
  FieldType,
  RuneEdict,
  RuneEtching,
  RuneField,
  RuneMessage,
  RuneStone,
  RuneTerms
} from '@/types.js'

import CONST from '@/const.js'

const { _0n } = CONST.BIG

export function decode_runestone (
  runestone : Bytes
) : RuneStone {
  const bytes = Buff.bytes(runestone)
  const ints  = parse_LEB128(bytes)
  const msg   = decode_rune_msg(ints)
  const stone = { edicts: msg.edicts }
  decode_etching(stone, msg.fields)
  decode_mint(stone, msg.fields)
  decode_pointer(stone, msg.fields)
  return stone
}

function decode_rune_msg (
  varints : bigint[]
) : RuneMessage {
  const fields : RuneField[] = []
  const edicts : RuneEdict[] = []

  let idx : number

  for (idx = 0; idx < varints.length; idx++) {
    const fbyte = varints[idx]

    if (fbyte === _0n) { idx++; break }

    const tag = decode_field_tag(fbyte)

    if (tag === null) continue

    if (tag === 'mint') {
      const height = varints.at(++idx)
      const index  = varints.at(++idx)
      assert.exists(height, 'height does not exist for mint field')
      assert.exists(index,  'index does not exist for mint field')
      fields.push([ 'mint', [ height, index ] ])
    } else {
      const val = varints.at(++idx)
      assert.exists(val, 'value does not exist for field: ' + tag)
      fields.push([ tag, val ])
    }
  }

  const ebytes = varints.slice(idx)

  assert.ok(ebytes.length % 4 === 0, 'edicts bytes are non-uniform')

  for (let i = 0; i < ebytes.length; i += 4) {
    const edict : RuneEdict = {
      id  : { height: Number(ebytes[0]), idx: Number(ebytes[1]) },
      amt : ebytes[2],
      out : Number(ebytes[3])
    }
    edicts.push(edict)
  }

  edicts.sort((a, b) => a.id.height - b.id.height)
  edicts.sort((a, b) => a.id.idx - b.id.idx)

  return { fields, edicts }
}

function decode_field_tag (
  field_byte : bigint
) : FieldType | null {
  const int = Number(field_byte)
  assert.ok(int !== 0, 'encountered zero-value field byte')
  const tag = CONST.FIELD_MAP.get(int)
  if (tag === undefined) {
    if (int % 2 === 1) {
      return null
    } else {
      throw new Error('unrecognized field byte: ' + field_byte)
    }
  }
  return tag
}

function decode_etching (
  stone  : RuneStone,
  fields : RuneField[]
) : void {
  const etching : RuneEtching = {}
  const divisibility = fields.find(e => e[0] === 'divisibility')
  const premine      = fields.find(e => e[0] === 'premine')
  const rune         = fields.find(e => e[0] === 'rune')
  const spacers      = fields.find(e => e[0] === 'spacers')
  const symbol       = fields.find(e => e[0] === 'symbol')
  if (divisibility !== undefined) {
    assert.bigint(divisibility)
    etching.divisibility = Number(divisibility)
  }
  if (premine !== undefined) {
    assert.bigint(premine)
    etching.premine = premine
  }
  if (rune !== undefined) {
    assert.bigint(rune)
    etching.rune = decode_base26(rune)
  }
  if (spacers !== undefined) {
    assert.bigint(spacers)
    etching.spacers = decode_bitfield(spacers)
  }
  if (symbol !== undefined) {
    assert.bigint(symbol)
    etching.symbol = Buff.big(symbol).str
  }
  // Decode and add terms, if present.
  decode_terms(etching, fields)
  // If etching has any fields defined:
  if (Object.keys(etching).length > 0) {
    // Set the etching field on the runestone.
    stone.etching = etching
  }
}

function decode_terms (
  etching : RuneEtching,
  fields  : RuneField[]
) {
  const terms : RuneTerms = {}
  const amount       = fields.find(e => e[0] === 'amount')
  const cap          = fields.find(e => e[0] === 'cap')
  const height_start = fields.find(e => e[0] === 'height_start')
  const height_end   = fields.find(e => e[0] === 'height_end')
  const offset_start = fields.find(e => e[0] === 'offset_start')
  const offset_end   = fields.find(e => e[0] === 'offset_end')
  if (amount !== undefined) {
    assert.bigint(amount)
    terms.amount = amount
  }
  if (cap !== undefined) {
    assert.bigint(cap)
    terms.cap = cap
  }
  if (height_start !== undefined) {
    assert.exists(height_end, 'height_end is not defined')
    assert.bigint(height_start)
    assert.bigint(height_end)
    terms.height = [ Number(height_start), Number(height_end) ]
  }
  if (offset_start !== undefined) {
    assert.exists(offset_end, 'offset_end is not defined')
    assert.bigint(offset_start)
    assert.bigint(offset_end)
    terms.height = [ Number(offset_start), Number(offset_end) ]
  }
  if (Object.keys(terms).length > 0) {
    etching.terms = terms
  }
}

function decode_mint (
  stone  : RuneStone,
  fields : RuneField[]
) : void {
  const res = fields.find(e => e[0] === 'mint')
  if (res !== undefined) {
    assert.big_array(res[1], 2)
    const [ b, i ] = res[1]
    stone.mint = { height: Number(b), idx: Number(i) }
  }
}

function decode_pointer (
  stone  : RuneStone,
  fields : RuneField[]
) : void {
  const res = fields.find(e => e[0] === 'pointer')
  if (res !== undefined) {
    assert.bigint(res[1])
    stone.pointer = Number(res[1])
  }
}

import { Buff }          from '@cmdcode/buff'
import { encode_LEB128 } from '@/lib/leb.js'

import {
  lookup_tag,
  encode_base26,
  encode_bitfield
} from './util.js'

import { RuneEtching, RuneField, RuneStone, RuneTerms } from '@/types.js'

export function encode_runestone (stone : RuneStone) {
  const { edicts = [], etching, mint, pointer } = stone

  const fields : RuneField[] = []
  const bytes  : number[]    = []

  if (etching !== undefined) {
    fields.push(...encode_etching(etching))
  }

  if (mint !== undefined) {
    fields.push([ 'mint', [ BigInt(mint.height), BigInt(mint.idx) ] ])
  }

  if (pointer !== undefined) {
    fields.push([ 'pointer', BigInt(pointer) ])
  }

  const lebs = encode_fields(fields)

  lebs.push(0)

  for (const edict of edicts) {
    const { id, amt, out } = edict
    lebs.push(id.height, id.idx, amt, out)
  }

  for (const leb of lebs) {
    const ints = encode_LEB128(leb)
    bytes.push(...ints)
  }

  return new Buff(bytes)
}

export function encode_fields (fields : RuneField[]) : (number | bigint)[] {
  const lebs : (number | bigint)[] = []
  for (const [ tag, val ] of fields) {
    const int  = lookup_tag(tag)
    const vals = Array.isArray(val) ? val : [ val ]
    lebs.push(int)
    lebs.push(...vals)
  }
  return lebs
}

export function encode_etching (etching : RuneEtching) {
  const fields : RuneField[] = []
  if (etching.divisibility !== undefined) {
    const val = BigInt(etching.divisibility)
    fields.push([ 'divisibility', val ])
  }
  if (etching.premine !== undefined) {
    const val = etching.premine
    fields.push([ 'premine', val ])
  }
  if (etching.rune !== undefined) {
    const val = encode_base26(etching.rune)
    fields.push([ 'rune', val ])
  }
  if (etching.spacers !== undefined) {
    const val = encode_bitfield(etching.spacers)
    fields.push([ 'spacers', val ])
  }
  if (etching.symbol !== undefined) {
    const val = Buff.str(etching.symbol).big
    fields.push([ 'symbol', val ])
  }
  if (etching.terms !== undefined) {
    const terms = encode_terms(etching.terms)
    fields.push(...terms)
  }
  return fields
}

export function encode_terms (terms : RuneTerms) {
  const fields : RuneField[] = []
  if (terms.amount !== undefined) {
    const val = terms.amount
    fields.push([ 'amount', val ])
  }
  if (terms.cap !== undefined) {
    const val = terms.cap
    fields.push([ 'cap', val ])
  }
  if (terms.height !== undefined) {
    const [ min, max ] = terms.height
    fields.push([ 'height_start', BigInt(min) ])
    fields.push([ 'height_end',   BigInt(max) ])
  }
  if (terms.offset !== undefined) {
    const [ min, max ] = terms.offset
    fields.push([ 'offset_start', BigInt(min) ])
    fields.push([ 'offset_end',   BigInt(max) ])
  }
  return fields
}

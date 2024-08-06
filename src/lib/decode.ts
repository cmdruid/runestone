import { Buff, Bytes }   from '@cmdcode/buff'
import { decode_LEB128 } from '@/lib/leb.js'
import { assert }        from '@/util/index.js'

import {
  FieldType,
  RuneEdict,
  RuneField,
  RuneMessage
} from '@/types.js'

import CONST from '@/const.js'

const { _0n } = CONST.BIG

export function decode_runestone (
  runestone : Bytes
) : RuneMessage {
  const bytes = Buff.bytes(runestone)
  const nums  = [ ...bytes ]
  const vars  = []
  while (nums.length !== 0) {
    const int = decode_LEB128(nums)
    vars.push(int)
  }
  return decode_rune_message(vars)
}

function decode_rune_message (
  varints : bigint[]
) : RuneMessage {
  const fields : RuneField[] = []
  const edicts : RuneEdict[] = []

  let idx : number

  for (idx = 0; idx < varints.length; idx++) {
    const fbyte = varints[idx]

    if (fbyte === _0n) break

    const tag = decode_field_tag(fbyte)

    if (tag === null) continue

    const val = varints.at(++idx)

    assert.exists(val, 'value does not exist for field: ' + tag)

    fields.push([ tag, val ])
  }

  const ebytes = varints.slice(idx)

  assert.ok(ebytes.length % 4 === 0, 'edicts bytes are non-uniform')

  for (let i = 0; i < ebytes.length; i += 4) {
    const edict : RuneEdict = {
      id  : { height: Number(ebytes[0]), idx: Number(ebytes[1]) },
      amt : ebytes[2],
      out : Number(ebytes[2])
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

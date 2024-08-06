import { assert }    from '@/util/index.js'
import { FieldType } from '@/types.js'

import CONST from '@/const.js'

export function lookup_tag (tag : FieldType) {
  const tags = CONST.FIELD_TAGS
  const idx  = tags.findIndex(e => e === tag)
  assert.ok(idx !== -1, 'tag not recognized: ' + tag)
  const int  = CONST.FIELD_TYPES.at(idx)
  assert.exists(int)
  return int
}

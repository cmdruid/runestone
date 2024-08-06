import { FieldType } from './types.js'

const FIELD_MAP = new Map<number, FieldType>([
  [ 0,   'body'         ],
  [ 2,   'flags'        ],
  [ 4,   'rune'         ],
  [ 6,   'premine'      ],
  [ 8,   'cap'          ],
  [ 10,  'amount'       ],
  [ 12,  'height_start' ],
  [ 14,  'height_end'   ],
  [ 16,  'offset_start' ],
  [ 18,  'offset_end'   ],
  [ 20,  'mint'         ],
  [ 22,  'pointer'      ],
  [ 126, 'cenotaph'     ],
  [ 1,   'divisibility' ],
  [ 3,   'spacers'      ],
  [ 5,   'symbol'       ],
  [ 127, 'nop'          ]
])

const FIELD_TYPES = [ ...FIELD_MAP.keys()   ]
const FIELD_TAGS  = [ ...FIELD_MAP.values() ]

const BIG = {
  _n1n : BigInt(-1),
  _0n  : BigInt(0),
  _7n  : BigInt(7),
  _32n : BigInt(32),
  _MAX : BigInt(0xFFFFFFFF)
}

export default { BIG, FIELD_MAP, FIELD_TAGS, FIELD_TYPES }

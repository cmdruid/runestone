export type FieldType = 'body' | 'flags' | 'rune' | 'premine' | 'cap' |
                  'amount' | 'height_start' | 'height_end'      |
                  'offset_start' | 'offset_end' | 'mint'        |
                  'pointer' | 'cenotaph' | 'divisibility'       |
                  'spacers' | 'symbol'   | 'nop'

export interface RuneID {
  height : number
  idx    : number
}

export type RuneField = [ tag : FieldType, value : bigint | bigint[] ]

export interface RuneMessage {
  fields : RuneField[]
  edicts : RuneEdict[]
}

export interface RuneTerms {
  amount ?: bigint
  cap    ?: bigint
  height ?: [ min : number, max : number ]
  offset ?: [ min : number, max : number ]
}

export interface RuneEtching {
  divisibility ?: number
  premine      ?: bigint
  rune         ?: string
  spacers      ?: string
  symbol       ?: string
  terms        ?: RuneTerms
}

export interface RuneStone {
  edicts   : RuneEdict[]
  etching ?: RuneEtching
  mint    ?: RuneID
  pointer ?: number
}

export interface RuneEdict {
  id  : RuneID
  amt : bigint
  out : number
}

export interface RuneFlag {
  etching  : boolean
  terms    : boolean
  turbo    : boolean
  cenotaph : boolean
}

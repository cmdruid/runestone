export type FieldType = 'body' | 'flags' | 'rune' | 'premine' | 'cap' |
                  'amount' | 'height_start' | 'height_end'      |
                  'offset_start' | 'offset_end' | 'mint'        |
                  'pointer' | 'cenotaph' | 'divisibility'       |
                  'spacers' | 'symbol'   | 'nop'

export interface RuneID {
  height : number
  idx    : number
}

export type RuneField = [ tag : FieldType, value : bigint ]

export interface RuneMessage {
  fields : RuneField[]
  edicts : RuneEdict[]
}

export interface RuneTerms {
  amount ?: Uint8Array
  cap    ?: Uint8Array
  height ?: Uint8Array
  offset ?: Uint8Array
}

export interface RuneEtching {
  divisibility : Uint8Array
  premine      : Uint8Array
  rune         : Uint8Array
  spacers      : Uint8Array
  symbol       : Uint8Array
  terms        : Uint8Array
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

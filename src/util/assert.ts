import * as check from './check.js'

export function ok (
  value    : unknown,
  message ?: string
) : asserts value {
  if (value === false) {
    throw new Error(message ?? 'Assertion failed!')
  }
}

export function exists <T> (
  value : T | null,
  msg  ?: string
  ) : asserts value is NonNullable<T> {
  if (!check.exists(value)) {
    throw new Error(msg ?? 'Value is null or undefined!')
  }
}

export function bigint (
  value    : unknown,
  message ?: string
) : asserts value is bigint {
  if (typeof value !== 'bigint') {
    throw new Error(message ?? 'value is not a bigint: ' + String(value))
  }
}

export function big_array (
  value    : unknown,
  size    ?: number,
  message ?: string
) : asserts value is bigint[] {
  if (!Array.isArray(value)) {
    throw new Error(message ?? 'value is not an array')
  }
  if (size !== undefined && value.length !== size) {
    throw new Error(message ?? `value array is incorrect size: ${value.length} !== ${size}`)
  }
  if (!value.every(e => typeof e === 'bigint')) {
    throw new Error(message ?? 'value array contains non-bigint members: ' + String(value))
  }
}

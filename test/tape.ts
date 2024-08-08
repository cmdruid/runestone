import tape from 'tape'

import basic_test from './src/basic.test.js'

tape('Runestone Test Suite', t => {
  basic_test(t)
  t.end()
})

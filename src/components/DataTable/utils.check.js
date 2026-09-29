// Run: node src/components/DataTable/utils.check.js
import assert from 'node:assert/strict'
import { operatorFilterFn, toDelimited, toSqlInserts, luminance, stripDeselectedAdditional } from './utils.js'

const row = (v) => ({ getValue: () => v })
const f = (v, operator, value) => operatorFilterFn(row(v), 'c', { operator, value })

assert.equal(f(5, '=', '5'), true)
assert.equal(f(5, '=', 5), true) // non-string filter value used to never match
assert.equal(f('Abc', '~~*', 'b'), true)
assert.equal(f('Abc', '~~', 'b'), true)
assert.equal(f('Abc', '~~', 'B'), false)
assert.equal(f(12, 'in', 12), true) // used to throw on value.split
assert.equal(f(null, '!~~*', 'x'), false)
assert.equal(f(10, '>', '9'), true) // numeric, not string compare
assert.equal(f(null, 'is', 'null'), true)
assert.equal(f('x', '=', ''), true) // empty filter is a no-op

assert.equal(toDelimited([{ a: 'x"y', b: 'p,q', c: null }]), 'a,b,c\n"x""y","p,q",')
assert.equal(toDelimited([{ a: 'x\ty', __stagedId: 's' }], '\t'), 'a\nx y')
assert.equal(toSqlInserts([{ a: "o'k", b: 1, c: undefined }], 't'), "INSERT INTO t (a, b, c) VALUES ('o''k', 1, NULL);")

assert.ok(luminance('#fff') > 0.99)
assert.equal(luminance('#000000'), 0)
assert.equal(luminance('rgb(1,2,3)'), 0)

assert.deepEqual(stripDeselectedAdditional({ 1: true, 2: true }, { 1: true }, [2, 3]), [3])
assert.equal(stripDeselectedAdditional({ 1: true }, { 1: true }, [2]), null)

console.log('utils.check.js: ok')

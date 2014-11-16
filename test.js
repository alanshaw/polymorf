var test = require('tape')
var polymorf = require('./')

test('Dispatch to multiple functions', function (t) {
  t.plan(5)

  var now = new Date

  var fn = polymorf(
    [String, String],
    function (name, email) {
      t.equal(name, 'Dave', 'Expected name to be "Dave"')
      t.equal(email, 'dave@example.org', 'Expected email to be "dave@exmaple.org"')
    },
    [Number, String, Date],
    function (id, title, timestamp) {
      t.equal(id, 138, 'Expected id to be 138')
      t.equal(title, 'Beginning Node.js', 'Expected title to be "Beginning Node.js"')
      t.equal(timestamp, now, 'Expected timestamp to be ' + now)
    }
  )

  fn('Dave', 'dave@example.org')
  fn(138, 'Beginning Node.js', now)

  t.end()
})

test('Sets "this" correctly when polymorphic function is a method', function (t) {
  t.plan(1)
  t.end()
})

test('Returns value from polymorphic handler', function (t) {
  t.plan(1)
  t.end()
})

test('Add/remove polymorphic handler dynamically', function (t) {
  t.plan(1)
  t.end()
})

test('Match against custom "classes"', function (t) {
  t.plan(1)
  t.end()
})
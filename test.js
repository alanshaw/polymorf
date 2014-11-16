var test = require('tape')
var inherits = require('util').inherits
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

  var privateProperty = 'xxxx'

  function Thing () {
    this._privateProperty = privateProperty
  }

  Thing.prototype.do = polymorf([], function () {
    return this._privateProperty
  })

  var thing = new Thing

  t.equal(thing.do(), privateProperty, 'This set correctly in handler')
  t.end()
})

test('Returns value from polymorphic handler', function (t) {
  t.plan(1)
  var doubler = polymorf([Number], function double (num) {
    return num * 2
  })
  t.equal(doubler(2), 4, 'Double two should be 4')
  t.end()
})

test('Add/remove polymorphic handler dynamically', function (t) {
  t.plan(4)

  var add = polymorf(
    [String, String],
    function (a, b) {
      return parseFloat(a) + parseFloat(b)
    }
  )

  t.equal(add('1', '0.2'), 1.2, '"1" + "0.2" should equal 1.2')

  // Shouldn't be able to add two numbers together...yet!
  t.throws(function () { add(5, 2) })

  add.polymorf.add(
    [Number, Number],
    function (a, b) {
      return a + b
    }
  )

  t.equal(add(3, 6), 9, '3 + 6 should equal 9')

  add.polymorf.remove([Number, Number])

  // Shouldn't be able to add two numbers anymore
  t.throws(function () { add(5, 2) })

  t.end()
})

test('Match against custom "classes"', function (t) {
  t.plan(1)

  function Vehicle () {}
  function Car () {}
  inherits(Car, Vehicle)

  var fn = polymorf(
    [Vehicle],
    function (vehicle) {
      return vehicle
    },
    [Vehicle, Function],
    function (vehicle, callback) {
      callback(null, vehicle)
    }
  )

  var car = new Car

  fn(car, function (er, vehicle) {
    t.equals(vehicle, car, 'Vehicle should be car')
    t.end()
  })
})

test('Throws when no matching signature found', function (t) {
  t.plan(1)
  t.throws(function () {
    var fn = polymorf()
    fn(1, 2, 3)
  })
  t.end()
})

test('Match against null/undefined', function (t) {
  t.plan(9)

  var counts = {success: 0, failure: 0}

  var result = {foo: 'bar'}

  var callback = polymorf(
    [null, Object],
    function success (er, res) {
      t.ifError(er, 'er should NEVER be not null/undefined')
      t.equal(res, result, 'Result should be expected object')
      counts.success++
    },
    [Error],
    function failure (er) {
      t.ok(er, 'Failure!')
      counts.failure++
    }
  )

  function doThing (succeed, cb) {
    if (succeed) {
      cb(null, result)
    } else {
      cb(new Error('Failed to succeed'))
    }
  }

  doThing(true, callback)
  doThing(true, callback)
  doThing(false, callback)
  doThing(false, callback)
  doThing(false, callback)

  t.equal(counts.success, 2, 'Correct success count')
  t.equal(counts.failure, 3, 'Correct failure count')

  t.end()
})
var is = require('is-type')

// Check if the value is-a type
function isType (type, val) {
  return (type == Object && is.object(val))
      || (type == Function && is.function(val))
      || (type == String && is.string(val))
      || (type == Error && is.error(val))
      || (type == Number && is.number(val))
      || (type == Array && is.array(val))
      || (type == Boolean && is.boolean(val))
      || (type == RegExp && is.regExp(val))
      || (type == Date && is.date(val))
      || (val instanceof type)
}

// Find a morph for the passed arguments
function findMorph (args, morphs) {
  for (var i = 0; i < morphs.length; i++) {
    var sig = morphs[i].sig

    if (args.length == sig.length) {
      var matched = true

      for (var j = 0; j < sig.length; j++) {
        if (!isType(sig[j], args[j])) {
          matched = false
          break
        }
      }

      if (matched) {
        return morphs[i]
      }
    }
  }
  throw new Error('No matching function signature')
}

module.exports = function () {
  var morphs = []

  for (var i = 0; i < arguments.length; i += 2) {
    morphs.push({sig: arguments[i], fn: arguments[i + 1]})
  }

  function dispatch () {
    var morph = findMorph(arguments, morphs)
    return morph.fn.apply(this, arguments)
  }

  dispatch.polymorf = {
    add: function (sig, fn) {
      morphs.push({sig: sig, fn: fn})
      return dispatch
    },
    remove: function (sig) {
      morphs = morphs.filter(function (morph) {
        if (morph.sig.length != sig.length) return true

        for (var i = 0; i < sig.length; i++) {
          if (sig[i] != morph.sig[i]) return true
        }

        return false
      })
      return dispatch
    }
  }

  return dispatch
}
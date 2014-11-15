// Check if the value is-a type
function isType (type, val) {
  if (type == Number) {

  }

  return val instanceof type
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

  return function polymorphicDispatch () {
    var morph = findMorph(arguments, morphs)
    return morph.fn.apply(this, arguments)
  }
}
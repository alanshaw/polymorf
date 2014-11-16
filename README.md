# polymorf [![Build Status](https://img.shields.io/travis/alanshaw/polymorf.svg?style=flat)](https://travis-ci.org/alanshaw/polymorf) [![Dependency Status](https://david-dm.org/alanshaw/polymorf.svg?style=flat)](https://david-dm.org/alanshaw/polymorf)

Create a polymorphic function that dispatches to different handler functions based on the type of the parameters it is passed.

## Example

```js
var add = polymorf(
  [Number, Number],
  function (a, b) {
    return a + b
  },
  [String, String],
  function (a, b) {
    // Don't concat
    return parseFloat(a) + parseFloat(b)
  }
)

add(2, 3) // 5
add('10', '12') // 22
```

## API

### `polymorf([signature, handler] [, [signature, handler] ...])`

Create a new polymorphic function. Arguments are `signature, handler` pairs, where `signature` is an array of **types** and `handler` is the function to be called if the polymorphic function is called with arguments whose types match the signature.

#### Allowed types

The following types are permitted as values in the signature array.

* Object
* Function
* String
* Error
* Number
* Array
* Boolean
* RegExp
* Date
* null
* undefined

You can also pass your own custom types. Internally polymorf will check if values match the type in the signature using the `instanceof` operator.

##### `polymorf.Any`

Use the `polymorf.Any` type matcher to match **any** value.

### `fn.polymorf.add(signature, handler)`

Given a polymorphic function `fn`, a new handler for a signature can be dynamically added. e.g.

```js
var doubler = polymorf()

try {
    doubler(4) // Throws
} catch (er) {
    console.error('No signatures to match against')
}

doubler.polymorf.add([Number], function (x) {
    return x * 2
})

doubler(4) // 8
```

### `fn.polymorf.remove(signature)`

Given a polymorphic function `fn`, an existing handler for a signature can be dynamically removed.
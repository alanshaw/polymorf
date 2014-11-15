var test = require('tape')
var polymorf = require('./')

test('test', function (t) {

  polymorf(
    [String, String],
    function (str, str) {

    },
    [Number, String],
    function (int, str) {

    }
  )

})
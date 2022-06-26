
var Cache = require("./index.js").Cache
var assert = require("assert")

var c
var v

c = new Cache()
v = c.get("foo")
assert(v === null)

c.put("foo", "bar")
v = c.get("foo")
assert(v === "bar")

c.del("foo")
v = c.get("foo")
assert(v === null)

c.put("foo", [5,7,11], 1)
v = c.get("foo")
assert(v instanceof Array)
assert(v.length === 3)

v = c.get("foo")
assert(v !== null)
setTimeout(function() {

	v = c.get("foo")
	assert(v === null)

	c = new Cache(null, {tickSecs:3})
	c.put("foo", {x:17}, 2)
	v = c.get("foo")
	assert(v !== null)
	setTimeout(function() {
		v = c.get("foo")
		assert(v === null)
		console.log("Tests passed - ^C to exit")
	}, 4 * 1000)

}, 2 * 1000)



/*
Copyright 2013 Sleepless Software Inc. All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to
deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
sell copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE. 
*/

var DS = require( 'ds' ).DS


// secs since epoch
var time = function() { return Math.floor( (new Date()).getTime() / 1000 ) }

var nop = function() {}

var Cache = function(file, opts) {

	var self = this

	opts = opts || {}

	var store = self.store = new DS(file, opts)
	if( store[ "_expireTimes" ] === undefined ) {
		store[ "_expireTimes" ] = {}
	}
	var expireTimes = store[ "_expireTimes" ]

	self.put = function(key, val, ttl) {

		ttl = parseInt(ttl) || 0

		if(!key)
			return null

		var oldVal = store[ key ] || null

		if(val === null) {
			// a null val means "remove value from cache"
			delete expireTimes[ key ]
			delete store[ key ]
			return oldVal
		}

		store[ key ] = val;

		delete expireTimes[ key ]
		if( ttl > 0 ) {
			var ts = time()
			var x = ts + ttl
			expireTimes[ key ] = x
		}

		return oldVal
	}


	self.get = function(key) {

		if(!key)
			return null
		var x = expireTimes[ key ];
		var ts = time()
		if( x && ts >= x ) {
			// cached value expired. delete from cache and return null
			delete expireTimes[ key ];
			delete store[ key ];
			return null
		}

		return store[ key ] || null
	}

	self.del = function(key) {
		return self.put(key, null)
	}

	self.save = function(file) {
		store.save(file)
	}

	// periodically expire cached values if tickSecs option provided
	self.tick = function() {
		for(var key in store) {
			var xt = expireTimes[ key ];
			if( xt && time() >= xt ) {
				delete expireTimes[ key ];
				delete store[ key ];
			}
		}
	}
	var ts = parseInt(opts.tickSecs, 10) || 0
	if(ts > 0)
		setInterval(self.tick, ts * 1000)

}


exports.Cache = Cache


if(require.main === module) {
	require("./test.js")
}



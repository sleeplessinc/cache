/*
Copyright 2011 Sleepless Software Inc. All rights reserved.

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


var DS		= require( 'ds' ).DS;


// return current unix timestamp; secs since epoch
var time = function() { return Math.floor( (new Date()).getTime() / 1000 ) }


var Cache = function(file, opts) {

	opts = opts || {}
	
	var self = this

	var store = self.store = new DS(file, opts)
	if( store[ "_expireTimes" ] === undefined ) {
		store[ "_expireTimes" ] = {}
	}
	var expireTimes = store[ "_expireTimes" ]

	var nop = function() {}


	self.set = function(key, val, ttl, cb) {

		cb = cb || nop

		if(!key) {
			cb('bad key', null)
			return
		}

		var oldVal = store[ key ] || null

		if(val === null) {
			// clear value from cache
			delete expireTimes[ key ]
			delete store[ key ]
			cb(null, oldVal)
			return
		}

		store[ key ] = val;

		if( ttl > 0 ) 
			expireTimes[ key ] = time() + ttl;

		cb(null, oldVal)
	}


	self.get = function(key, cb) {

		cb = cb || nop

		if(!key) {
			cb('bad key', null)
			return;
		}
		var x = expireTimes[ key ];
		if( x && time() >= x ) {
			// cached value expired - return null
			delete expireTimes[ key ];
			delete store[ key ];
		}
		cb(null, store[ key ] || null )
	}

	self.save = function(file) {
		store.save(file)
	}


	self.tick = function() {
		// expire cached values
		for(var key in store) {
			var xt = expireTimes[ key ];
			if( xt && time() >= xt ) {
				delete expireTimes[ key ];
				delete store[ key ];
			}
		}
	}
	var ts = parseInt(opts.tickSecs) || 0
	if(ts > 0)
		setInterval(self.tick, ts * 1000)

}


exports.Cache = Cache


if(require.main === module) {
	require("./test.js")
}



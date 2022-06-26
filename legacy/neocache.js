
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

function Cache(ttl) {

	var me = this;

	me.now = function() { return (new Date()).getTime() }
	me.ttl = ttl;
	me.data = {}

	me.get = function(key) {
		var val = null
		var obj = me.data[key]
		if(obj) {
			val = obj.val
			if(me.now() >= obj.expires) {
				val = null
				delete me.data[key]
			}
		}
		return val
	}

	me.del = function(key) {
		var oldval = me.get(key); 
		delete me.data[key]
		return oldval
	}

	me.put = function(key, val) {
		var oldval = me.del(key); 
		if(val !== null)
			me.data[ key ] = { expires: me.now() + me.ttl, val: val }
		return oldval
	}

}


module.exports = Cache;



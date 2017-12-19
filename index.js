
// Copyright 2017 Sleepless Software Inc. All rights reserved.

function Cache(ttl) {

	var me = this;

	me.now = function() { return (new Date()).getTime() }
	me.ttl = ttl || 0;
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

	me.put = function(key, val, ttl) {
		if(ttl === undefined) {
			ttl = me.ttl;
		}
		var oldval = me.del(key); 
		if(val !== null)
			me.data[ key ] = { expires: me.now() + ttl, val: val }
		return oldval
	}

}

module.exports = Cache;


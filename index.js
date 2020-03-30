
// Copyright 2017 Sleepless Software Inc. All rights reserved.

DS = require("ds").DS;

function Cache(ttl, save_file) {

	var me = this;

	me.now = function() { return (new Date()).getTime() }
	me.ttl = ttl || 0;
	//me.data = {}
	me.data = new DS(save_file);

	me.get = function(key, cb) {
		var val = null
		var obj = me.data[key]
		if(obj) {
			val = obj.val
			if(me.now() >= obj.expires) {
				val = null
				delete me.data[key]
				me.save();
			}
		}
		if(cb)
			cb(val);
		return val
	}

	me.del = function(key, cb) {
		var oldval = me.get(key); 
		delete me.data[key]
		me.save();
		if(cb)
			cb(oldval)
		return oldval
	}

	me.put = function(key, val, ttl, cb) {
		if(ttl === undefined) {
			ttl = me.ttl;
		}
		var oldval = me.del(key); 
		if(val !== null) {
			me.data[ key ] = { expires: me.now() + ttl, val: val }
			me.save();
		}
		if(cb)
			cb(oldval)
		return oldval
	}

	me.save = function() {
		if( save_file ) {
			me.data.save(save_file);
		}
	}
}

module.exports = Cache;


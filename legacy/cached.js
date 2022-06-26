

var Cache = require("./index.js").Cache
var rpc = require("rpc")


exports.createServer = function(file) {

	var cache = new Cache(file)

	var api = {
		get: function(cb, key) {
			cache.get(key, function(err, val) {
				cb(val)
			})
		},
		set: function(cb, key, val, ttl) {
			cache.set(key, val, ttl, function(err, oldVal) {
				cb(oldVal)
			})
		}
	}

	return rpc.createServer(api)
}


if(require.main === module) {
	exports.createServer().listen(12345)
}


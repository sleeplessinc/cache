
# Cache - A simple caching object with TTL

## Usage

	npm install cache


	Cache = require("cache");

	c = new Cache(10);		// new cache with 10 second TTL

	var key = "akey";
	var val = "something";

	c.put(key, val);

	c.get(key);				// "something";

	// 11 seconds later ...
	setTimeout(function() {
		c.get(key);			// null
	}, 11 * 1000);





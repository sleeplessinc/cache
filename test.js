
function throwIf(c, s) {
	if(c) {
		throw new Error("FAIL: "+s);
	}
};

function log(s) {
	console.log(s);
}

// ---------------

Cache = require("./index.js");


c = new Cache(1 * 1000);		// defaults to 1 sec TTL

c.put("1", "one");				// use default 1 sec TTL
c.put("6", "six", 6 * 1000);	// specify 6 sec TTL for this key

throwIf(c.get("1") !== "one");

setTimeout(()=> {
	log("2 secs ...");

	throwIf(c.get("1") !== null);

	throwIf(c.get("6") !== "six");

	setTimeout(()=> {
		log("4 secs ...");

		// should still be there
		throwIf(c.get("6") !== "six");

		setTimeout(()=> {
			log("6 secs ...");

			// should be gone now
			throwIf(c.get("6") !== null);

			console.log("All tests passed.");

		}, 2 * 1000);

	}, 2 * 1000);

}, 2 * 1000);



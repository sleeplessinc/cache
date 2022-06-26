# Cache - A simple cache for JSON data with a REST API


## Node usage


## REST API

### /?act=set&key=foo&val=7&ttl=secs&save=true

	Stores the given value under the key "foo".

	"key" is required.

	"val" is required, and must be valid JSON text:
		0
		"string"
		[1,2,3]
		{"foo":null}
		etc.

	If val is "null", or the JSON can't be parsed, the value will be deleted.

	"ttl" and "save" are optional:

		ttl:
			The value will flushed from cache after "secs" seconds.
			Attempts to "get" the value will return null.
			If ttl is 0 or is omitted, then the value doesn't expire.

		save:
			If "true", cache is saved to disk after value is set or deleted.


### /?act=get&key=foo

	Return the object stored under the key "foo".


### /?act=save

	Force cache to immediately be saved to disk.

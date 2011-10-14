<?

require_once "json.php";		// json2obj and obj2json functions

$cacheHost = 'http://localhost:3000/';


function cache( $url, $rawOpts ) {
	$opts = array();
	foreach( $rawOpts as $key => $val ) {
		$opts[] = sprintf( '%s=%s', urlencode( $key ), urlencode( $val ) );
	}
	$uri = $url . '?' . implode( '&', $opts );
	$ch = curl_init( $uri );
	curl_setopt( $ch, CURLOPT_RETURNTRANSFER, 1 );
	$r = curl_exec( $ch );
	if($r === false) {
		//echo "ERROR: cache server unavailable\n";
		return null;
	}
	$o = json2obj($r);
	if($o->error) {
		//echo "ERROR: $o->error\n";
		return null;
	}
	return $o->value;
}

function cacheSet($k, $o, $ttl = 0) {
	global $cacheHost;
	$v = obj2json($o);
	$r = cache( $cacheHost, array(
		'act' => 'set',
		'key' => $k,
		'val' => obj2json($v),
		'ttl' => (int)$ttl
		));
	//echo "(cacheSet($k, $v) returning $r)\n";
	return $r;
}

function cacheGet($k) {
	global $cacheHost;
	$v = cache( $cacheHost, array( 'act' => 'get', 'key' => $k ) );
	//echo "(cacheGet($k) returning ".($v === null ? "null" : $v).")\n";
	return $v;
}


if(true) {

	// test code

	$cc = "(from cache)";
	$v = cacheGet("foo");
	if($v == null) {
		$v = 15;
		$cc = "";
		cacheSet("foo", $v, 10);
	}

	echo "v is $v $cc\n";
}

?>

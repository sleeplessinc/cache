<?

function get( $url, $rawOpts ) {

	$opts = array();

	foreach( $rawOpts as $key => $val ) {
		$opts[] = sprintf( '%s=%s', urlencode( $key ), urlencode( $val ) );
	}

	$uri = $url . '?' . implode( '&', $opts );

	$ch = curl_init( $uri );

	curl_setopt( $ch, CURLOPT_RETURNTRANSFER, 1 );

	return curl_exec( $ch );
}

$host = 'http://example.com:3000';

print "SETTING VALUE 'foo' to { 'foo' : 'bar' } : " . get( $host, array( 'act' => 'set', 'key' => 'foo', 'val' => '{ "foo" : "bar" }' ) );

print '<br/></br/>';

print "RETRIEVING VALUE OF 'foo' : " . get( $host, array( 'act' => 'get', 'key' => 'foo' ) );

?>

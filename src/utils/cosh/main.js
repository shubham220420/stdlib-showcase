

'use strict';



function cosh( x ) {
	if ( Number.isNaN( x ) ) {
		return x;
	}
	if ( x < 0.0 ) {
		x = -x;
	}
	if ( x > 21.0 ) {
		return Math.exp( x ) / 2.0;
	}
	return ( Math.exp( x ) + Math.exp( -x ) ) / 2.0;
}


export default cosh;

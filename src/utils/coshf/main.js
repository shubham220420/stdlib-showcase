

'use strict';


const PINF = Infinity;
const MAXLOGF = 88.72283935546875;



function f32( x ) {
	return Math.fround( x );
}


function isnanf( x ) {
	return Number.isNaN( x );
}


function isInfinitef( x ) {
	return !Number.isFinite( x ) && !Number.isNaN( x );
}


const ZERO = f32( 0.0 );
const ONE = f32( 1.0 );
const TWO = f32( 2.0 );



function coshf( x ) {
	var z;
	if ( isnanf( x ) ) {
		return x;
	}
	if ( x < ZERO ) {
		x = -x;
	}
	if ( isInfinitef( x ) || x > MAXLOGF ) {
		return PINF;
	}
	z = f32( Math.exp( f32( x ) ) );
	z = f32( z + ( ONE / z ) );
	return f32( z / TWO );
}


export default coshf;

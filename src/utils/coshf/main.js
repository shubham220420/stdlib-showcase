/**
* @license Apache-2.0
*
* Copyright (c) 2026 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
*
* ## Notice
*
* The original C code, long comment, copyright, license, and constants are from [Cephes]{@link http://www.netlib.org/cephes}. The implementation follows the original, but has been modified for JavaScript.
*
* ```text
* Copyright 1985, 1995, 2000 by Stephen L. Moshier
* ```
*/

'use strict';

// CONSTANTS //

const PINF = Infinity;
const MAXLOGF = 88.72283935546875; // Maximum value of ln(x) for float32

// HELPER //

/**
* Converts a double-precision floating-point number to single-precision.
*
* @param {number} x - input value
* @returns {number} single-precision value
*/
function f32( x ) {
	return Math.fround( x );
}

/**
* Tests if a single-precision floating-point number is NaN.
*
* @param {number} x - input value
* @returns {boolean} boolean indicating whether value is NaN
*/
function isnanf( x ) {
	return Number.isNaN( x );
}

/**
* Tests if a single-precision floating-point number is infinite.
*
* @param {number} x - input value
* @returns {boolean} boolean indicating whether value is infinite
*/
function isInfinitef( x ) {
	return !Number.isFinite( x ) && !Number.isNaN( x );
}

// VARIABLES //

const ZERO = f32( 0.0 );
const ONE = f32( 1.0 );
const TWO = f32( 2.0 );

// MAIN //

/**
* Computes the hyperbolic cosine of a single-precision floating-point number.
*
* ## Method
*
* ```tex
* \operatorname{coshf}(x) = \frac{ \exp(x) + \exp(-x) }{2}
* ```
*
* @param {number} x - input value
* @returns {number} hyperbolic cosine
*
* @example
* var v = coshf( 0.0 );
* // returns 1.0
*
* @example
* var v = coshf( 2.0 );
* // returns ~3.762
*
* @example
* var v = coshf( -2.0 );
* // returns ~3.762
*
* @example
* var v = coshf( NaN );
* // returns NaN
*/
function coshf( x ) {
	var z;
	if ( isnanf( x ) ) {
		return x;
	}
	if ( x < ZERO ) {
		x = -x;
	}
	// Handle infinities & overflows:
	if ( isInfinitef( x ) || x > MAXLOGF ) {
		return PINF;
	}
	z = f32( Math.exp( f32( x ) ) );
	z = f32( z + ( ONE / z ) );
	return f32( z / TWO );
}

// EXPORTS //

export default coshf;

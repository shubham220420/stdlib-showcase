/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
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

// MAIN //

/**
* Computes the hyperbolic cosine of a double-precision floating-point number.
*
* ## Method
*
* ```tex
* \operatorname{cosh}(x) = \frac{ \exp(x) + \exp(-x) }{2}
* ```
*
* @param {number} x - input value
* @returns {number} hyperbolic cosine
*
* @example
* var v = cosh( 0.0 );
* // returns 1.0
*
* @example
* var v = cosh( 2.0 );
* // returns ~3.762
*
* @example
* var v = cosh( -2.0 );
* // returns ~3.762
*
* @example
* var v = cosh( NaN );
* // returns NaN
*/
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

// EXPORTS //

export default cosh;

# stdlib showcase — Hyperbolic Cosine Precision Visualizer

An interactive visualization comparing double-precision `cosh` and single-precision `coshf` from [@stdlib/math/base/special](https://github.com/stdlib-js/stdlib/tree/develop/lib/node_modules/%40stdlib/math/base/special).

This showcase highlights the implementation of `coshf`, which I contributed to stdlib, and explores precision differences between single and double precision computations.

---

## Functions

### `cosh(x)` — Double Precision (float64)

Computes the hyperbolic cosine of a number using 64-bit IEEE 754 double-precision floating-point arithmetic.

```js
var uniform = require( '@stdlib/random/array/uniform' );
var logEachMap = require( '@stdlib/console/log-each-map' );
var cosh = require( '@stdlib/math/base/special/cosh' );

var opts = {
	'dtype': 'float64'
};
var x = uniform( 10, -5.0, 5.0, opts );
logEachMap( 'cosh(%lf) = %lf', x, cosh );
```

**Precision:** ~15–17 significant decimal digits.  
**Range:** Defined for all real numbers. Returns `Infinity` when `|x| > 709.78` (exceeds float64 max exponent).

---

### `coshf(x)` — Single Precision (float32)

Computes the hyperbolic cosine of a number using 32-bit IEEE 754 single-precision floating-point arithmetic.

```js
var uniform = require( '@stdlib/random/array/uniform' );
var logEachMap = require( '@stdlib/console/log-each-map' );
var coshf = require( '@stdlib/math/base/special/coshf' );

var opts = {
	'dtype': 'float32'
};
var x = uniform( 10, -5.0, 5.0, opts );

logEachMap( 'coshf(%f) = %f', x, coshf );
```

**Precision:** ~6–9 significant decimal digits.  
**Range:** Returns `Infinity` when `|x| > 88.72` (exceeds float32 max exponent `MAXLOGF = 88.72283935546875`).

---

## Mathematical Definition

$$
\cosh(x) = \frac{e^x + e^{-x}}{2}
$$

### Properties

| Property | Description |
|---|---|
| `cosh(0) = 1` | Global minimum of the function |
| `cosh(-x) = cosh(x)` | Even function — symmetric about the y-axis |
| `cosh(x) ≥ 1` | For all real x |
| Growth | Grows exponentially as \|x\| → ∞ |
| Relation to sinh | `cosh²(x) − sinh²(x) = 1` (Pythagorean identity) |

---

The visualizer lets you compare how early `coshf` overflows to `Infinity` compared to `cosh` — visible by raising the x-axis range past ±89.

---

## Repository Traffic Dashboard

The site now includes a dedicated `stdlib Traffic` view for `stdlib-js/stdlib`.

- **Contributors**: unique commit contributors active during the selected rolling window
- **Pull requests**: PRs opened during the selected rolling window
- **Issues**: issues opened during the selected rolling window
- **Contributor details**: profile, company, location, followers, public repositories, commit totals, additions, deletions, and last active week

The traffic view supports both preset windows (`1 week`, `1 month`, `3 months`, `6 months`) and a custom start/end date filter.

The dashboard uses the public GitHub REST API directly in the browser. To reduce rate-limit problems, the app caches GitHub responses, reuses search results across views, and only fetches extended profile details for the top contributors in the current range. If you still hit unauthenticated rate limits during local development, add a GitHub token to your environment:

```bash
VITE_GITHUB_TOKEN=your_github_token
```

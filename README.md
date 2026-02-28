# stdlib showcase — Hyperbolic Cosine Precision Visualizer

An interactive visualization comparing double-precision `cosh` and single-precision `coshf` from [@stdlib/math/base/special](https://github.com/stdlib-js/stdlib/tree/develop/lib/node_modules/%40stdlib/math/base/special).

---

## Functions

### `cosh(x)` — Double Precision (float64)

Computes the hyperbolic cosine of a number using 64-bit IEEE 754 double-precision floating-point arithmetic.

```js
import cosh from "@stdlib/math/base/special/cosh";

cosh( 0.0 )   // => 1.0
cosh( 2.0 )   // => 3.7621956910213425
cosh( -2.0 )  // => 3.7621956910213425
cosh( Infinity )  // => Infinity
cosh( NaN )   // => NaN
```

**Precision:** ~15–17 significant decimal digits.  
**Range:** Defined for all real numbers. Returns `Infinity` when `|x| > 709.78` (exceeds float64 max exponent).

---

### `coshf(x)` — Single Precision (float32)

Computes the hyperbolic cosine of a number using 32-bit IEEE 754 single-precision floating-point arithmetic.

```js
import coshf from "@stdlib/math/base/special/coshf";

coshf( 0.0 )   // => 1.0
coshf( 2.0 )   // => 3.7621956 (float32 rounded)
coshf( -2.0 )  // => 3.7621956
coshf( Infinity )  // => Infinity
coshf( NaN )   // => NaN
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

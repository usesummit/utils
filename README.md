# Summit JS Utils

Useful methods for handling numbers, mostly.

Came out of the need for re-using some helper methods across multiple codebases at [Summit](https://usesummit.com).

## Contents

-   `calculateHumanReadableNumber` turns a number into a `[number, abbreviation]` tuple, so that you can pass the `number` to any number formatter and then add the `abbreviation` as a suffix. You can use this to pretty-print `47965012.48` to `47.96MM`. This doesn't handle rounding or fraction digits, use your regular number formatter for that (i.e. [`Intl.NumberFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat))
-   `parseHumanReadableNumber` can parse numbers like `1.52MM` and `1,234,456.78` to floats
-   `getIdentifier` generates and stores a unique identifier so you can anonymously identify users or sessions

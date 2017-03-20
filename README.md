# merge-extends.js [![npm module](https://img.shields.io/npm/v/merge-extends.svg)](https://www.npmjs.com/package/merge-extends) [![Travis CI Status](https://travis-ci.org/jokeyrhyme/merge-extends.js.svg?branch=master)](https://travis-ci.org/jokeyrhyme/merge-extends.js)

walk the extend(s) property of an object, returning a single merged object


## Usage


```js
import { mergeExtends, merger } from 'merge-extends';

const objects = new Map();

const getter = (id) => objects.get(id);

// you can just pass an identifier if you like
objects.set('abc', { abc: 123 });
mergeExtends('abc', getter); // { abc: 123 }

// or you can pass a whole source object
objects.set('def', { def: 456 });
mergeExtends({ lmn: 345, extend: 'def' }, getter); // { def: 456, lmn: 345 }

// you can conveniently use the same getter over and over
const objectsMerger = merger(getter);
objects.set('ghi', { ghi: 789, extend: 'def' });
objectsMerger('ghi'); // { def: 456, ghi: 789 }

// we also support an array of extends
objects.set('jki', { jki: 1012, extends: ['abc', 'ghi'] });
objectsMerger('jki'); // { abc: 123, def: 456, ghi: 789, jki: 1012 }

// an optional customiser can be used to implement deep merging
const concatArrays = (targetValue, sourceValue) => {
  return Array.isArray(targetValue) ? targetValue.concat(sourceValue) : sourceValue;
};
const customObjectsMerger = merger(getter, concatArrays);
objects.set('birds', { names: [ 'canary' ] });
objects.set('fish', { names: [ 'sardine' ] });
objects.set('fauna', { extends: [ 'birds', 'fish' ] });
customObjectsMerger('fauna'); // { names: [ 'canary', 'sardine' ] }
```


### API


#### `mergeExtends(source, getter, customiser)`

- @param {Object|String} source
- @param {Function} getter
- @param {Function} [customiser]
- @returns {Object}

Like [lodash.assign()](https://lodash.com/docs#assign),
we invoke the optional `customiser` function with five arguments:
(targetValue, sourceValue, key, target, source).


#### `merger(getter, customiser)`

- @param {Function} getter
- @param {Function} [customiser]
- @returns {Function}

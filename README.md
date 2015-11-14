# merge-extends.js

walk the extend(s) property of an object, returning a single merged object

[![Build Status](https://travis-ci.org/jokeyrhyme/merge-extends.js.png)](https://travis-ci.org/jokeyrhyme/merge-extends.js)


## Usage


```js
import { mergeExtends, merger } from 'merge-extends';

const objects = new Map();

const getter = (id) => {
  return objects.get(id);
};

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
```


### API


#### `mergeExtends(source, getter)`

- @param {Object|String} source
- @param {Function} getter
- @returns {Object}


#### `merger(getter)`

- @param {Function} getter
- @returns {Function}

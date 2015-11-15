'use strict';

// foreign modules

const test = require('ava');

// local modules

const { mergeExtends, merger } = require('..');

// this module

const objects = new Map();
objects.set('abc', { abc: 123 });
objects.set('def', { def: 456 });
objects.set('ghi', { ghi: 789, extend: 'def' });
objects.set('jki', { jki: 1012, extends: ['abc', 'ghi'] });

const getter = (id) => objects.get(id);

const concatArrays = (targetValue, sourceValue) => {
  return Array.isArray(targetValue) ? targetValue.concat(sourceValue) : sourceValue;
};

let objectsMerger;
test.before((t) => {
  objectsMerger = merger(getter);
  t.end();
});

test('mergeExtends is a function', (t) => {
  t.is(typeof mergeExtends, 'function');
  t.end();
});

test('merger is a function, returns a function', (t) => {
  t.is(typeof merger, 'function');
  t.is(typeof objectsMerger, 'function');
  t.end();
});

test('pass an identifier', (t) => {
  t.same(mergeExtends('abc', getter), { abc: 123 });
  t.end();
});

test('pass a whole source object', (t) => {
  t.same(
    mergeExtends({ lmn: 345, extend: 'def' }, getter),
    { def: 456, lmn: 345 }
  );
  t.end();
});

test('use the same getter', (t) => {
  t.same(objectsMerger('ghi'), { def: 456, ghi: 789 });
  t.end();
});

test('support an array of extends', (t) => {
  t.same(objectsMerger('jki'), { abc: 123, def: 456, ghi: 789, jki: 1012 });
  t.end();
});

test('optional customiser', (t) => {
  const myMerger = merger(getter, concatArrays);
  objects.set('birds', { names: [ 'canary' ] });
  objects.set('fish', { names: [ 'sardine' ] });
  objects.set('fauna', { extends: [ 'birds', 'fish' ] });
  t.same(myMerger('fauna'), { names: [ 'canary', 'sardine' ] });
  t.end();
});

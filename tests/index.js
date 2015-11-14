'use strict';

// foreign modules

const test = require('ava');

// local modules

const mergeExtends = require('..');

// this module

test('exports a function', (t) => {
  t.is(typeof mergeExtends, 'function');
  t.end();
});

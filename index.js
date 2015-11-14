'use strict';

// a customised version of Object.assign() poly-fill
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
function assignWithoutExtends (target) {
  'use strict';
  var to, i, nextSource, keysArray, nextIndex, len, nextKey, desc;
  if (typeof target === 'undefined' || target === null) {
    throw new TypeError('Cannot convert first argument to object');
  }

  to = Object(target);
  for (i = 1; i < arguments.length; i += 1) {
    nextSource = arguments[i];
    if (typeof nextSource === 'undefined' || nextSource === null) {
      continue;
    }
    nextSource = Object(nextSource);

    keysArray = Object.keys(nextSource);
    for (nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
      nextKey = keysArray[nextIndex];
      if (nextKey === 'extend' || nextKey === 'extends') {
        continue;
      }
      desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
      if (typeof desc !== 'undefined' && desc.enumerable) {
        to[nextKey] = nextSource[nextKey];
      }
    }
  }
  return to;
}

/*
@param {Object|String} source
@param {Function} getter
@returns {Object}
*/
module.exports.mergeExtends = function mergeExtends (source, getter) {
  var srcObj, sources, extendz;

  // use the getter to dereference a sourceId
  if (typeof source === 'string') {
    srcObj = getter(source);
  } else {
    srcObj = source;
  }

  // ensure we have an Array of extends
  extendz = srcObj.extend || srcObj.extends || [];
  if (!Array.isArray(extendz)) {
    extendz = [ extendz ];
  }

  // early exit if we have nothing to do
  if (!extendz.length) {
    return srcObj;
  }

  // get all source objects
  sources = extendz.map(function (ex) {
    return mergeExtends(getter(ex), getter);
  });

  return assignWithoutExtends.apply(null, [ {}, srcObj ].concat(sources));
};

/*
@param {Function} getter
@returns {Function}
*/
module.exports.merger = function merger (getter) {
  return function (source) {
    return module.exports.mergeExtends(source, getter);
  };
};

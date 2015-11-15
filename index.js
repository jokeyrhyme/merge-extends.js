'use strict';

function defaultCustomiser (targetValue, sourceValue, key, target, source) {
  return sourceValue;
}

// a customised version of Object.assign() poly-fill
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
function assignWithoutExtends (customiser, target) {
  'use strict';
  var to, i, nextSource, keysArray, nextIndex, len, nextKey, desc;
  if (typeof target === 'undefined' || target === null) {
    throw new TypeError('Cannot convert first argument to object');
  }

  to = Object(target);
  for (i = 2; i < arguments.length; i += 1) {
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
        to[nextKey] = customiser(to[nextKey], nextSource[nextKey], nextKey, to, nextSource);
      }
    }
  }
  return to;
}

/*
@param {Object|String} source
@param {Function} getter
@param {Function} [customiser]
@returns {Object}
*/
module.exports.mergeExtends = function mergeExtends (source, getter, customiser) {
  var customFn, srcObj, sources, extendz;

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

  customFn = customiser || defaultCustomiser;

  // get all source objects
  sources = extendz.map(function (ex) {
    return mergeExtends(getter(ex), getter, customFn);
  });

  return assignWithoutExtends.apply(null, [ customFn, {}, srcObj ].concat(sources));
};

/*
@param {Function} getter
@param {Function} [customiser]
@returns {Function}
*/
module.exports.merger = function merger (getter, customiser) {
  return function (source) {
    return module.exports.mergeExtends(source, getter, customiser);
  };
};

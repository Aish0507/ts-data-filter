import { isCompositeFilterDescriptor } from './purge.interface';
import { getter } from '../index';
import { isFunction, isPresent, isDate, isString, isBlank, isNumeric } from '../data-check';
const logic = {
  or: {
    concat: (acc: any, fn: any) => (a) => acc(a) || fn(a),
    identity: () => false,
  },
  and: {
    concat: (acc: any, fn: any) => (a) => acc(a) && fn(a),
    identity: () => true,
  },
};
const operatorsMap = {
  contains: (a: any, b: any) => (a || '').indexOf(b) >= 0,
  doesnotcontain: (a: any, b: any) => (a || '').indexOf(b) === -1,
  doesnotendwith: (a: any, b: any) => (a || '').indexOf(b, (a || '').length - (b || '').length) < 0,
  doesnotstartwith: (a: any, b: any) => (a || '').lastIndexOf(b, 0) === -1,
  endswith: (a: any, b: any) => (a || '').indexOf(b, (a || '').length - (b || '').length) >= 0,
  eq: (a: any, b: any) => a === b,
  gt: (a: any, b: any) => a > b,
  gte: (a: any, b: any) => a >= b,
  isempty: (a: any) => a === '',
  isnotempty: (a: any) => a !== '',
  isnotnull: (a: any) => isPresent(a),
  isnull: (a: any) => isBlank(a),
  lt: (a: any, b: any) => a < b,
  lte: (a: any, b: any) => a <= b,
  neq: (a: any, b: any) => a != b,
  startswith: (a: any, b: any) => (a || '').lastIndexOf(b, 0) === 0,
};
const dateRegExp = /^\/Date\((.*?)\)\/$/;
const convertValue = (value: any, ignoreCase: any) => {
  if (value != null && isString(value)) {
    const date = dateRegExp.exec(value);
    if (date) {
      return new Date(+date[1]).getTime();
    } else if (ignoreCase) {
      return value.toLowerCase();
    }
  } else if (value != null && isDate(value)) {
    return value.getTime();
  }
  return value;
};
const typedGetter = (prop: any, value: any, ignoreCase: any) => {
  if (!isPresent(value)) {
    return prop;
  }
  let acc = prop;
  if (isString(value)) {
    const date = dateRegExp.exec(value);
    if (date) {
      value = new Date(+date[1]);
    } else {
      acc = (a) => {
        const x = prop(a);
        if (typeof x === 'string' && ignoreCase) {
          return x.toLowerCase();
        } else {
          return isNumeric(x) ? x + '' : x;
        }
      };
    }
  }
  if (isDate(value)) {
    return (a) => {
      const x = acc(a);
      return isDate(x) ? x.getTime() : x;
    };
  }
  return acc;
};
const transformFilter = ({ field, ignoreCase, value, operator }) => {
  field = !isPresent(field) ? (a) => a : field;
  ignoreCase = isPresent(ignoreCase) ? ignoreCase : true;
  const itemProp = typedGetter(isFunction(field) ? field : getter(field, true), value, ignoreCase);
  value = convertValue(value, ignoreCase);
  const op = isFunction(operator) ? operator : operatorsMap[operator];
  return (a) => op(itemProp(a), value, ignoreCase);
};
/**
 * @hidden
 */
export const transformCompositeFilter = (filter) => {
  const combiner = logic[filter.logic];
  return filter.filters
    .filter(isPresent)
    .map((x) => (isCompositeFilterDescriptor(x) ? transformCompositeFilter(x) : transformFilter(x)))
    .reduce(combiner.concat, combiner.identity);
};

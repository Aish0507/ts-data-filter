import { isPresent, isString, isArray } from '../data-check';
import { isCompositeFilterDescriptor } from './purge.interface';
const operatorMap = (key: any) =>
  ({
    '!=': 'neq',
    '<': 'lt',
    '<=': 'lte',
    '==': 'eq',
    '>': 'gt',
    '>=': 'gte',
    equal: 'eq',
    equals: 'eq',
    equalto: 'eq',
    ge: 'gte',
    greater: 'gt',
    greaterthan: 'gt',
    greaterthanequal: 'gte',
    isempty: 'isempty',
    isequalto: 'eq',
    isgreaterthan: 'gt',
    isgreaterthanorequalto: 'gte',
    islessthan: 'lt',
    islessthanorequalto: 'lte',
    isnotempty: 'isnotempty',
    isnotequalto: 'neq',
    isnull: 'isnull',
    le: 'lte',
    less: 'lt',
    lessthan: 'lt',
    lessthanequal: 'lte',
    ne: 'neq',
    notequal: 'neq',
    notequals: 'neq',
    notequalto: 'neq',
    notsubstringof: 'doesnotcontain',
  }[key.toLowerCase()] || key);
const normalizeOperator = (descriptor) => {
  if (descriptor.filters) {
    descriptor.filters = descriptor.filters.map((filter) => {
      const result = Object.assign({}, filter);
      if (!isCompositeFilterDescriptor(filter) && isString(filter.operator)) {
        result.operator = operatorMap(filter.operator);
      }
      if (isCompositeFilterDescriptor(filter)) {
        normalizeOperator(result);
      }
      return result;
    });
  }
};
const normalizeDescriptor = (descriptor: any) => {
  if (!isCompositeFilterDescriptor(descriptor)) {
    return {
      filters: isArray(descriptor) ? descriptor : [descriptor],
      logic: 'and',
    };
  }
  return Object.assign({}, descriptor);
};

export const normalizeFilters = (descriptor: any) => {
  if (isPresent(descriptor)) {
    descriptor = normalizeDescriptor(descriptor);
    normalizeOperator(descriptor);
  }
  return descriptor;
};

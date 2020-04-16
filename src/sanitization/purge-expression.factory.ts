import { isPresent } from '../data-check';
import { isCompositeFilterDescriptor } from './purge.interface';
import { normalizeFilters } from './purge.operators';
import { transformCompositeFilter } from './purge-transform';
export const compileFilter = (descriptor) => {
  if (!descriptor || descriptor.filters.length === 0) {
    return () => true;
  }
  return transformCompositeFilter(descriptor);
};
export const filterBy = (data, descriptor) => {
  if (!isPresent(descriptor) || (isCompositeFilterDescriptor(descriptor) && descriptor.filters.length === 0)) {
    return data;
  }
  return data.filter(compileFilter(normalizeFilters(descriptor)));
};

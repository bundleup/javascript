import { isObject } from '../utils';

describe('isObject', () => {
  it('should return true for plain objects', () => {
    expect(isObject({})).toBe(true);
    expect(isObject({ key: 'value' })).toBe(true);
    expect(isObject({ nested: { key: 'value' } })).toBe(true);
  });

  it('should return false for null', () => {
    expect(isObject(null)).toBe(false);
  });

  it('should return false for arrays', () => {
    expect(isObject([])).toBe(false);
    expect(isObject([1, 2, 3])).toBe(false);
  });

  it('should return false for primitive types', () => {
    expect(isObject('string')).toBe(false);
    expect(isObject(123)).toBe(false);
    expect(isObject(true)).toBe(false);
    expect(isObject(undefined)).toBe(false);
  });

  it('should return false for functions', () => {
    expect(isObject(() => {})).toBe(false);
    expect(isObject(function () {})).toBe(false);
  });

  it('should return true for Date objects', () => {
    expect(isObject(new Date())).toBe(true);
  });

  it('should return true for RegExp objects', () => {
    expect(isObject(/regex/)).toBe(true);
  });
});

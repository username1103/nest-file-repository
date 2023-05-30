import { normalizePath } from './shared.util';

describe('Shared Util', () => {
  describe('normalizePath', () => {
    it('should remove all trailing slashes at the end of the path', () => {
      expect(normalizePath('path/')).toBe('/path');
      expect(normalizePath('path///')).toBe('/path');
      expect(normalizePath('/path/path///')).toBe('/path/path');
    });
    it('should replace all slashes with only one slash', () => {
      expect(normalizePath('////path/')).toBe('/path');
      expect(normalizePath('///')).toBe('/');
      expect(normalizePath('/path////path///')).toBe('/path/path');
    });
    it('should return / for empty path', () => {
      expect(normalizePath('')).toBe('/');
      expect(normalizePath(null as any)).toBe('/');
      expect(normalizePath(undefined)).toBe('/');
    });
  });
});

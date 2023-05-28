import { lazyLoadPackage } from './lazy-load-package';

describe('LazyLoadPackage', () => {
  it('load package', async () => {
    // given, when, then
    expect(lazyLoadPackage('reflect-metadata', 'ctx')).toBe(
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('reflect-metadata'),
    );
  });
});

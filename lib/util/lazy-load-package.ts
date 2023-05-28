export const MISSING_REQUIRED_DEPENDENCY = (name: string, reason: string) =>
  `The "${name}" package is missing. Please, make sure to install this library ($ npm install ${name}) to take advantage of ${reason}.`;

export function lazyLoadPackage(
  packageName: string,
  ctx: string,
  // eslint-disable-next-line @typescript-eslint/ban-types
  loadFn?: Function,
) {
  try {
    return loadFn ? loadFn() : require(packageName);
  } catch (e) {
    console.error(MISSING_REQUIRED_DEPENDENCY(packageName, ctx));
    process.exit(1);
  }
}

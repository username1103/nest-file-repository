export function lazyLoadPackage(
  packageName: string,
  // eslint-disable-next-line @typescript-eslint/ban-types
  loadFn?: Function,
) {
  try {
    return loadFn ? loadFn() : require(packageName);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

export const normalizePath = (path?: string): string =>
  path
    ? path.startsWith('/')
      ? ('/' + path.replace(/\/+$/, '')).replace(/\/+/g, '/')
      : '/' + path.replace(/\/+$/, '')
    : '/';

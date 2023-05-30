export const normalizePath = (path?: string): string => {
  if (!path) return '/';

  if (path.startsWith('/')) {
    return ('/' + path.replace(/\/+$/, '')).replace(/\/+/g, '/');
  }

  return '/' + path.replace(/\/+$/, '');
};

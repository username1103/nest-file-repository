export const MIMETYPE = {
  TEXT: 'text/plain',
  HTML: 'text/html',
  CSS: 'text/css',
  JAVA_SCRIPT: 'application/javascript',
  JSON: 'application/json',
  XML: 'application/xml',
  CSV: 'text/csv',
  PDF: 'application/pdf',
  JPEG: 'image/jpeg',
  PNG: 'image/png',
  WEBP: 'image/webp',
  GIF: 'image/gif',
  SVG: 'image/svg+xml',
};

export type Mimetype = (typeof MIMETYPE)[keyof typeof MIMETYPE];

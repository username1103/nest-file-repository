export const EXTENSION = {
  TEXT: '.txt',
  HTML: '.html',
  CSS: '.css',
  JAVA_SCRIPT: '.js',
  JSON: '.json',
  XML: '.xml',
  CSV: '.csv',
  PDF: '.pdf',
  JPG: '.jpg',
  JPEG: '.jpeg',
  PNG: '.png',
  WEBP: '.webp',
  GIF: '.gif',
  SVG: '.svg',
  EMPTY: '',
} as const;

export type Extension = (typeof EXTENSION)[keyof typeof EXTENSION];

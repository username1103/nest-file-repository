import { Mimetype } from '../constant/mimetype';

export interface MimetypeExtensionConverter {
  getMimeType(extension: string): Mimetype;
}

export const MIMETYPE_EXTENSION_CONVERTER = Symbol(
  'MIMETYPE_EXTENSION_CONVERTER',
);

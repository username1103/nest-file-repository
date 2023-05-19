import { EXTENSION, Extension } from '../constant/extension';
import { MIMETYPE, Mimetype } from '../constant/mimetype';
import { MimetypeExtensionConverter } from '../interface/mimetype-extension-converter';

export class DefaultMimetypeExtensionConverter
  implements MimetypeExtensionConverter
{
  getMimeType(extension: string): Mimetype {
    if (!this.isValidExtension(extension) || extension === EXTENSION.EMPTY) {
      return MIMETYPE.APPLICATION_OCTET_STREAM;
    }

    switch (extension) {
      case EXTENSION.JPG:
      case EXTENSION.JPEG:
        return MIMETYPE.JPEG;
      case EXTENSION.PNG:
        return MIMETYPE.PNG;
      case EXTENSION.WEBP:
        return MIMETYPE.WEBP;
      case EXTENSION.GIF:
        return MIMETYPE.GIF;
      case EXTENSION.SVG:
        return MIMETYPE.SVG;
      case EXTENSION.CSV:
        return MIMETYPE.CSV;
      case EXTENSION.CSS:
        return MIMETYPE.CSS;
      case EXTENSION.TEXT:
        return MIMETYPE.TEXT;
      case EXTENSION.HTML:
        return MIMETYPE.HTML;
      case EXTENSION.JSON:
        return MIMETYPE.JSON;
      case EXTENSION.PDF:
        return MIMETYPE.PDF;
      case EXTENSION.XML:
        return MIMETYPE.XML;
      case EXTENSION.JAVA_SCRIPT:
        return MIMETYPE.JAVA_SCRIPT;
      default:
        this.unknownExtension(extension);
    }
  }

  private isValidExtension(extension: string): extension is Extension {
    return Object.values<string>(EXTENSION).includes(extension);
  }

  private unknownExtension(extension: never): never {
    throw new Error(`Unknown Extension: ${JSON.stringify(extension)}`);
  }
}

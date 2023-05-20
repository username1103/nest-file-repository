import { DefaultMimetypeExtensionConverter } from './default-mimetype-extension-converter';
import { EXTENSION } from '../constant/extension';
import { MIMETYPE } from '../constant/mimetype';

describe('DefaultMimetypeExtensionConverter', () => {
  it('return application/octet-stream when empty string', async () => {
    // given
    const defaultMimetypeExtensionConverter =
      new DefaultMimetypeExtensionConverter();

    const extension = EXTENSION.EMPTY;

    // when
    const mimeType = defaultMimetypeExtensionConverter.getMimeType(extension);

    // then
    expect(mimeType).toBe(MIMETYPE.APPLICATION_OCTET_STREAM);
  });

  it('return application/octet-stream when invalid string', async () => {
    // given
    const defaultMimetypeExtensionConverter =
      new DefaultMimetypeExtensionConverter();

    const extension = 'invalid';

    // when
    const mimeType = defaultMimetypeExtensionConverter.getMimeType(extension);

    // then
    expect(mimeType).toBe(MIMETYPE.APPLICATION_OCTET_STREAM);
  });

  it.each([
    {
      extension: EXTENSION.JPG,
      mimetype: MIMETYPE.JPEG,
    },
    {
      extension: EXTENSION.JPEG,
      mimetype: MIMETYPE.JPEG,
    },
    {
      extension: EXTENSION.PNG,
      mimetype: MIMETYPE.PNG,
    },
    {
      extension: EXTENSION.WEBP,
      mimetype: MIMETYPE.WEBP,
    },
    {
      extension: EXTENSION.GIF,
      mimetype: MIMETYPE.GIF,
    },
    {
      extension: EXTENSION.SVG,
      mimetype: MIMETYPE.SVG,
    },
    {
      extension: EXTENSION.CSV,
      mimetype: MIMETYPE.CSV,
    },
    {
      extension: EXTENSION.TEXT,
      mimetype: MIMETYPE.TEXT,
    },
    {
      extension: EXTENSION.HTML,
      mimetype: MIMETYPE.HTML,
    },
    {
      extension: EXTENSION.CSS,
      mimetype: MIMETYPE.CSS,
    },
    {
      extension: EXTENSION.JAVA_SCRIPT,
      mimetype: MIMETYPE.JAVA_SCRIPT,
    },
    {
      extension: EXTENSION.PDF,
      mimetype: MIMETYPE.PDF,
    },
    {
      extension: EXTENSION.XML,
      mimetype: MIMETYPE.XML,
    },
    {
      extension: EXTENSION.JSON,
      mimetype: MIMETYPE.JSON,
    },
  ])(
    'return "$mimetype" when give "$extension"',
    async ({ mimetype, extension }) => {
      // given
      const defaultMimetypeExtensionConverter =
        new DefaultMimetypeExtensionConverter();

      // when
      const result = defaultMimetypeExtensionConverter.getMimeType(extension);

      // then
      expect(result).toBe(mimetype);
    },
  );
});

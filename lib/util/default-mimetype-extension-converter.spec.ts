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

  it('return image/jpeg when give valid extension(.jpg)', async () => {
    // given
    const defaultMimetypeExtensionConverter =
      new DefaultMimetypeExtensionConverter();

    const extension = EXTENSION.JPG;

    // when
    const mimeType = defaultMimetypeExtensionConverter.getMimeType(extension);

    // then
    expect(mimeType).toBe(MIMETYPE.JPEG);
  });
});

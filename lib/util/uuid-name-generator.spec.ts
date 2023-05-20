import { UuidNameGenerator } from './uuid-name-generator';
import { File } from '../File';

describe('UuidNameGenerator', () => {
  it('generate uuid name with file extension', async () => {
    // given
    const file = new File('test.txt', Buffer.from('hello, world'));
    const nameGenerator = new UuidNameGenerator();

    // when
    const name = nameGenerator.generate(file);

    // then
    expect(name.endsWith('.txt')).toBe(true);
    expect(name.slice(0, name.length - 4)).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
  });

  it('generate uuid name without extension if file has not extension', async () => {
    // given
    const file = new File('test', Buffer.from('hello, world'));
    const nameGenerator = new UuidNameGenerator();

    // when
    const name = nameGenerator.generate(file);

    // then
    expect(name).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
  });
});

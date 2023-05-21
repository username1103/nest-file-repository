import { MemoryFileRepository } from './memory-file-repository';
import { UploadStrategy } from '../../enum';
import { File } from '../../File';
import { MemoryFileRepositoryConfiguration } from '../interface/file-repository-configuration';

describe('MemoryFileRepository', () => {
  it('save file in storage', async () => {
    // given
    const config: MemoryFileRepositoryConfiguration = {
      strategy: UploadStrategy.MEMORY,
      options: {
        path: './test',
      },
    };
    const file = new File('test.txt', Buffer.from('hello'));

    const memoryFileRepository = new MemoryFileRepository(config);

    // when
    const result = await memoryFileRepository.save(file);

    // then
    expect(result).toBe('test/test.txt');
    const savedFile = await memoryFileRepository.get(result);
    expect(file).toBe(savedFile);
  });

  it('save file in storage when no path in options of config', async () => {
    // given
    const config: MemoryFileRepositoryConfiguration = {
      strategy: UploadStrategy.MEMORY,
    };
    const file = new File('test.txt', Buffer.from('hello'));

    const memoryFileRepository = new MemoryFileRepository(config);

    // when
    const result = await memoryFileRepository.save(file);

    // then
    expect(result).toBe('test.txt');
    const savedFile = await memoryFileRepository.get(result);
    expect(file).toBe(savedFile);
  });

  it('return null when querying data that does not exist', async () => {
    // given
    const config: MemoryFileRepositoryConfiguration = {
      strategy: UploadStrategy.MEMORY,
    };

    const memoryFileRepository = new MemoryFileRepository(config);

    // when
    const result = await memoryFileRepository.get('test.txt');

    // then
    expect(result).toBeNull();
  });
});

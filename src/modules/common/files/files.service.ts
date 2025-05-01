import { Injectable } from '@nestjs/common';

import { IFileRepository } from './repositories/file.repository.interface';
import { FileType } from './domain/file';
import { NullableType } from '@/utils/types/nullable.type';

@Injectable()
export class FilesService {
  constructor(private readonly fileRepository: IFileRepository) {}

  findById(id: FileType['id']): Promise<NullableType<FileType>> {
    return this.fileRepository.findById(id);
  }

  findByIds(ids: FileType['id'][]): Promise<FileType[]> {
    return this.fileRepository.findByIds(ids);
  }
}

import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import fileConfig from './config/file.config';
import { FileConfig, FileDriver } from './config/file-config.type';
import { FilesLocalModule } from './uploader/local/files.module';
import { FilesS3Module } from './uploader/s3/files.module';
import { FilesS3PresignedModule } from './uploader/s3-presigned/files.module';

const infrastructureUploaderModule =
  (fileConfig() as FileConfig).driver === FileDriver.LOCAL
    ? FilesLocalModule
    : (fileConfig() as FileConfig).driver === FileDriver.S3
      ? FilesS3Module
      : FilesS3PresignedModule;

@Module({
  imports: [infrastructureUploaderModule],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}

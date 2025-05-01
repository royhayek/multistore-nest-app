import { AppConfig } from './app-config.type';
import { AuthConfig } from '@/modules/common/auth/config/auth-config.type';
import { DatabaseConfig } from '@/database/config/database-config.type';
import { FileConfig } from '@/modules/common/files/config/file-config.type';
import { MailConfig } from '@/modules/common/mail/config/mail-config.type';

export type AllConfigType = {
  app: AppConfig;
  auth: AuthConfig;
  database: DatabaseConfig;
  file: FileConfig;
  mail: MailConfig;
};

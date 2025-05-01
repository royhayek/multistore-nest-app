import { Injectable } from '@nestjs/common';
import { Not } from 'typeorm';
import { SessionEntity } from '../entities/session.entity';
import { NullableType } from '@/utils/types/nullable.type';
import { ISessionRepository } from './session.repository.interface';
import { Session } from '../domain/session';
import { User } from '../../users/domain/user';
import { SessionMapper } from '../mappers/session.mapper';
import { DataSourceContext } from '@/common/data-source.context';
import { BaseRepository } from '@/common/base-repository';

@Injectable()
export class SessionRepository
  extends BaseRepository<SessionEntity>
  implements ISessionRepository
{
  constructor(dataSourceContext: DataSourceContext) {
    super(dataSourceContext, SessionEntity);
  }

  async findById(id: Session['id']): Promise<NullableType<Session>> {
    const repository = this.getRepository();
    const entity = await repository.findOne({
      where: {
        id: Number(id),
      },
    });

    return entity ? SessionMapper.toDomain(entity) : null;
  }

  async create(data: Session): Promise<Session> {
    const repository = this.getRepository();
    const persistenceModel = SessionMapper.toPersistence(data);
    return repository.save(repository.create(persistenceModel));
  }

  async update(
    id: Session['id'],
    payload: Partial<
      Omit<Session, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
    >,
  ): Promise<Session | null> {
    const repository = this.getRepository();
    const entity = await repository.findOne({
      where: { id: Number(id) },
    });

    if (!entity) {
      throw new Error('Session not found');
    }

    const updatedEntity = await repository.save(
      repository.create(
        SessionMapper.toPersistence({
          ...SessionMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return SessionMapper.toDomain(updatedEntity);
  }

  async deleteById(id: Session['id']): Promise<void> {
    const repository = this.getRepository();
    await repository.softDelete({
      id: Number(id),
    });
  }

  async deleteByUserId(conditions: { userId: User['id'] }): Promise<void> {
    const repository = this.getRepository();
    await repository.softDelete({
      user: {
        id: Number(conditions.userId),
      },
    });
  }

  async deleteByUserIdWithExclude(conditions: {
    userId: User['id'];
    excludeSessionId: Session['id'];
  }): Promise<void> {
    const repository = this.getRepository();
    await repository.softDelete({
      user: {
        id: Number(conditions.userId),
      },
      id: Not(Number(conditions.excludeSessionId)),
    });
  }
}

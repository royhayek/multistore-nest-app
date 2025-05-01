import * as bcrypt from 'bcryptjs';
import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';

// DTOs
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUserDto, SortUserDto } from './dto/query-user.dto';

// Domains
import { Role } from '../roles/domain/role';
import { UserStatus } from '../statuses/domain/status';

// Enums
import { User } from './domain/user';
import { StoreRoleEnum } from '../roles/roles.enum';
import { UserStatusEnum } from '../statuses/user-statuses.enum';

// Interfaces
import { IUserRepository } from './repository/user.repository.interface';

// Types
import { NullableType } from '@/utils/types/nullable.type';
import { IPaginationOptions } from '@/utils/types/pagination-options';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    let password: string | undefined = undefined;

    if (createUserDto.password) {
      const salt = await bcrypt.genSalt();
      password = await bcrypt.hash(createUserDto.password, salt);
    }

    let email: string | null = null;

    if (createUserDto.email) {
      const userObject = await this.userRepository.findByEmail(
        createUserDto.email,
      );
      if (userObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'emailAlreadyExists',
          },
        });
      }
      email = createUserDto.email;
    }

    let role: Role | undefined = undefined;

    if (createUserDto.roleId) {
      const roleObject = Object.values(StoreRoleEnum)
        .map(String)
        .includes(String(createUserDto.roleId));
      if (!roleObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            role: 'roleNotExists',
          },
        });
      }

      role = {
        id: createUserDto.roleId,
      };
    }

    let status: UserStatus | undefined = undefined;

    if (createUserDto.statusId) {
      const statusObject = Object.values(UserStatusEnum)
        .map(String)
        .includes(String(createUserDto.statusId));
      if (!statusObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            status: 'statusNotExists',
          },
        });
      }

      status = {
        id: createUserDto.statusId,
      };
    }

    return this.userRepository.create({
      phoneNumber: createUserDto.phoneNumber,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      email: email,
      password: password,
      role: role,
      status: status,
      roleId: createUserDto.roleId,
      statusId: createUserDto.statusId,
    });
  }

  findManyWithPagination({
    user,
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    user: User;
    filterOptions?: FilterUserDto | null;
    sortOptions?: SortUserDto | null;
    paginationOptions: IPaginationOptions;
  }): Promise<User[]> {
    return this.userRepository.findManyWithPagination({
      user,
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }

  findById(id: User['id']): Promise<NullableType<User>> {
    return this.userRepository.findById(id);
  }

  findByIds(ids: User['id'][]): Promise<User[]> {
    return this.userRepository.findByIds(ids);
  }

  findByEmail(email: User['email']): Promise<NullableType<User>> {
    return this.userRepository.findByEmail(email);
  }

  async update(
    id: User['id'],
    updateUserDto: UpdateUserDto,
  ): Promise<User | null> {
    // Do not remove comment below.
    // <updating-property />

    let password: string | undefined = undefined;

    if (updateUserDto.password) {
      const userObject = await this.userRepository.findById(id);

      if (userObject && userObject?.password !== updateUserDto.password) {
        const salt = await bcrypt.genSalt();
        password = await bcrypt.hash(updateUserDto.password, salt);
      }
    }

    let email: string | null | undefined = undefined;

    if (updateUserDto.email) {
      const userObject = await this.userRepository.findByEmail(
        updateUserDto.email,
      );

      if (userObject && userObject.id !== id) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'emailAlreadyExists',
          },
        });
      }

      email = updateUserDto.email;
    } else if (updateUserDto.email === null) {
      email = null;
    }

    let role: Role | undefined = undefined;

    if (updateUserDto.roleId) {
      const roleObject = Object.values(StoreRoleEnum)
        .map(String)
        .includes(String(updateUserDto.roleId));
      if (!roleObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            role: 'roleNotExists',
          },
        });
      }

      role = {
        id: updateUserDto.roleId,
      };
    }

    let status: UserStatus | undefined = undefined;

    if (updateUserDto.statusId) {
      const statusObject = Object.values(UserStatusEnum)
        .map(String)
        .includes(String(updateUserDto.statusId));
      if (!statusObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            status: 'statusNotExists',
          },
        });
      }

      status = {
        id: updateUserDto.statusId,
      };
    }

    return this.userRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      phoneNumber: updateUserDto.phoneNumber,
      firstName: updateUserDto.firstName,
      lastName: updateUserDto.lastName,
      email,
      password,
      role,
      status,
      roleId: updateUserDto.roleId,
      statusId: updateUserDto.statusId,
    });
  }

  async remove(id: User['id']): Promise<void> {
    await this.userRepository.remove(id);
  }
}

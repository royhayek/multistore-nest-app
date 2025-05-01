// Libraries
import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';

// DTOs
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

// Repositories
import { PermissionRepository } from './repository/permission.repository.interface';

// Utilities and Types
import { IPaginationOptions } from '@/utils/types/pagination-options';

// Models
import { Permission } from './domain/permission';
import { Role } from '../roles/domain/role';
import { PublicRoleEnum, StoreRoleEnum } from '../roles/roles.enum';

@Injectable()
export class PermissionsService {
  constructor(
    // Dependencies here
    private readonly permissionRepository: PermissionRepository,
  ) {}

  async create(createPermissionDto: CreatePermissionDto) {
    // Do not remove comment below.
    // <creating-property />
    let role: Role | undefined = undefined;

    if (createPermissionDto.role?.id) {
      const combinedRoles = {
        ...Object.values(StoreRoleEnum),
        ...Object.values(PublicRoleEnum),
      };

      const roleObject = Object.values(combinedRoles)
        .map(String)
        .includes(String(createPermissionDto.role.id));
      if (!roleObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            role: 'roleNotExists',
          },
        });
      }

      role = {
        id: createPermissionDto.role.id,
      };
    }

    return this.permissionRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      role,
      permission: createPermissionDto.permission,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.permissionRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Permission['id']) {
    return this.permissionRepository.findById(id);
  }

  findByIds(ids: Permission['id'][]) {
    return this.permissionRepository.findByIds(ids);
  }

  async update(
    id: Permission['id'],

    updatePermissionDto: UpdatePermissionDto,
  ) {
    // Do not remove comment below.
    // <updating-property />
    let role: Role | undefined = undefined;

    if (updatePermissionDto.role?.id) {
      const combinedRoles = {
        ...Object.values(StoreRoleEnum),
        ...Object.values(PublicRoleEnum),
      };

      const roleObject = Object.values(combinedRoles)
        .map(String)
        .includes(String(updatePermissionDto.role.id));
      if (!roleObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            role: 'roleNotExists',
          },
        });
      }

      role = {
        id: updatePermissionDto.role.id,
      };
    }

    return this.permissionRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      role,
      permission: updatePermissionDto.permission,
    });
  }

  remove(id: Permission['id']) {
    return this.permissionRepository.remove(id);
  }
}

import { AppDataSource } from '../../config/database/ormconfig'
import { MenuOptionRoles } from '../../entities/MenuOptionXRoles'
import { Role } from '../../entities/Role'
import { User } from '../../entities/User'
import { ConflictException } from '../../helpers/error-api'
import {
  AdvancedCondition,
  ApiResponse,
  QueryParams,
} from '../../types/api.types'
import { NotFoundException } from '../../helpers/error-api'
import { MenuOption } from '../../entities/MenuOption'
import { buildWhereClause } from '../../helpers/build-where-clause'
import { paginatedQuery } from '../../helpers/paginated-query'
import { HTTP_STATUS_NO_CONTENT } from '../../constants/status-codes'

export interface CreateRolePayload {
  name: string
  description: string
  created_by: number
  menu_options: string[]
}

export interface AssignPermissionPayload {
  role_id: number
  menu_options: string[]
}

export class RoleServices {
  private queryRunner = AppDataSource.createQueryRunner()
  private roleRepository = AppDataSource.getRepository(Role)
  private userRepository = AppDataSource.getRepository(User)
  private menuOptionRepository = AppDataSource.getRepository(MenuOption)
  private menuOptionRoleRepository =
    AppDataSource.getRepository(MenuOptionRoles)

  /**
   * Register a new role
   * @param payload - role data
   * @return The crated role
   */
  async create({
    menu_options,
    ...payload
  }: CreateRolePayload): Promise<ApiResponse<Role>> {
    const existingRole = await this.roleRepository.findOneBy({
      name: payload.name,
    })
    if (existingRole) {
      throw new ConflictException(
        'Ya ha registrado un rol con el nombre proporcionado.'
      )
    }

    const user = await this.userRepository.findOneBy({
      user_id: payload.created_by,
    })

    if (!user) {
      throw new NotFoundException(
        `User with id: '${payload.created_by}' not found.`
      )
    }

    await this.roleRepository.insert({
      ...payload,
      created_by: user,
    })

    const data = await this.roleRepository.findOneBy({ name: payload.name })

    const menu_option_roles: Partial<MenuOptionRoles>[] = []
    for (const option_id of menu_options) {
      const option = await this.menuOptionRepository.findOneBy({
        menu_option_id: option_id,
      })

      if (!option) {
        throw new NotFoundException(
          `Menu option with id '${option_id}' not found.`
        )
      }

      menu_option_roles.push({
        menu_option_id: option.menu_option_id,
        created_at: new Date(),
        role_id: data.role_id,
        created_by: payload.created_by,
      })
    }

    try {
      await this.menuOptionRoleRepository.insert(menu_option_roles)
    } catch (error) {
      throw new Error(
        'El rol se creo con éxito pero hubo un error al agregar las opciones de menu.'
      )
    }

    return { data }
  }

  /**
   * Get role list by a given condition
   * @param conditions - role condition
   * @param searchParams - search parameters
   * @returns The list of roles
   */
  async getRoleList(
    conditions: AdvancedCondition[],
    searchParams: QueryParams
  ): Promise<ApiResponse<Role[]>> {
    const { whereClause, parameters } = buildWhereClause(conditions)

    const statement = `
      SELECT * FROM (
          SELECT 
            CONCAT(name, ' ', description) AS filter,
            name,
            description,
            role_id,
            created_by,
            created_at,
            updated_at,
            updated_by,
            state
          FROM roles
        ) AS subquery
      WHERE ${whereClause}
      ORDER BY role_id ASC
    `

    const [data = [], metadata] = await paginatedQuery<Role>(
      statement,
      searchParams,
      parameters
    )

    if (data.length === 0) {
      return { status: HTTP_STATUS_NO_CONTENT }
    }

    return { data, metadata }
  }

  /**
   * Get all roles
   * @return The list of active roles
   */
  async getAllRoles(): Promise<ApiResponse<Role[]>> {
    const roles = await this.roleRepository.find({
      where: { state: 'A' },
    })

    if (!roles.length) {
      return { status: HTTP_STATUS_NO_CONTENT }
    }

    return { data: roles }
  }

  /**
   * Assign menu option to roles
   * @param payload - role and menu option data
   * @return The created object
   */
  async assign_permission(
    payload: AssignPermissionPayload
  ): Promise<ApiResponse<MenuOptionRoles[]>> {
    const role = await this.roleRepository.findOneBy({
      role_id: payload.role_id,
    })
    if (!role) {
      throw new NotFoundException(
        `Role with id: '${payload.role_id}' not found.`
      )
    }

    const menu_option_roles: MenuOptionRoles[] = []
    for (const menu_option_id of payload.menu_options) {
      const option = await this.menuOptionRepository.findOneBy({
        menu_option_id,
      })
      if (!option) {
        throw new NotFoundException(
          `Menu option with id '${menu_option_id}' not found.`
        )
      }

      const menu_option_role = await this.menuOptionRoleRepository.findOneBy({
        role_id: payload.role_id,
        menu_option_id,
      } as never)

      if (menu_option_role) {
        throw new ConflictException(
          `The role ${payload.role_id} already have access to ${menu_option_id} menu option.`
        )
      }

      menu_option_roles.push({
        role_id: role,
        menu_option_id: option,
      } as never)
    }

    const menuOptionRole =
      this.menuOptionRoleRepository.create(menu_option_roles)

    await this.menuOptionRoleRepository.save(menuOptionRole)

    return { message: 'Permission assigned successfully' }
  }
}

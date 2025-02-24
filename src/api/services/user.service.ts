import { Role } from '@src/entities/Role'
import { User } from '@src/entities/User'
import { AppDataSource } from '@src/config/database/ormconfig'
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  throwError,
  UnAuthorizedException,
} from '@src/helpers/error-api'
import { FindOptionsWhere, In } from 'typeorm'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import {
  AdvancedCondition,
  ApiResponse,
  QueryParams,
} from '@src/types/api.types'
import { UserRoles } from '@src/entities/UserXRoles'
import { objectsKeyToUpperCase } from '@src/helpers/objects-key-to-upper'
import { whereClauseBuilder } from '@src/helpers/where-clause-builder'
import { paginatedQuery } from '@src/helpers/paginated-query'
import { HTTP_STATUS_NO_CONTENT } from '@src/constants/status-codes'
import { buildWhereClause } from '@src/helpers/build-where-clause'
import { queryRunner } from '@src/helpers/query-utils'

export interface CreateUserPayload {
  address: string
  avatar: string
  birth_date: Date
  email: string
  identity_document: string
  last_name: string
  name: string
  password: string
  phone: string
  role_id: number
  username: string
}

export interface UpdateUserPayload
  extends Omit<Partial<User>, 'user_id' | 'username'> {
  user_id: number
  role_id: number
}

export interface AssignRolePayload {
  user_id: number
  roles: number[]
}

export interface UserSession {
  user_id: number
  username: string
  name: string
  avatar: string | null
  roles: string[]
  sessionCookie: {
    expiration: Date
    token: string
  }
}

export class UserService {
  private userRepository = AppDataSource.getRepository(User)
  private rolesRepository = AppDataSource.getRepository(Role)
  private userRolesRepository = AppDataSource.getRepository(UserRoles)

  /**
   * Register a new user
   * @param userData - user data, include username and password
   * @returns the created user
   */
  async register({
    role_id,
    ...userData
  }: CreateUserPayload): Promise<ApiResponse<User>> {
    if (await this.isFieldUsed('email', userData.email)) {
      throw new ConflictException(
        `El email: '${userData.email}' ya esta en uso.`
      )
    }

    if (await this.isFieldUsed('username', userData.username)) {
      throw new ConflictException(
        `El nombre de usuario: '${userData.username}' ya esta en uso.`
      )
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10)

    this.userRepository.insert({
      ...userData,
      password: hashedPassword,
    })

    const user = await this.userRepository.findOneBy({
      username: userData.username,
    })

    if (role_id) {
      const role = await this.rolesRepository.findOneBy({ role_id })

      if (!role?.role_id) {
        throw new ConflictException(`Rol with id '${role_id}' not found.`)
      }

      try {
        await this.userRolesRepository.insert({
          user,
          role,
          created_by: user.created_by,
          created_at: new Date(),
        })
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log({ error })
      }
    }

    return {
      data: user,
    }
  }

  /**
   * Update user data
   * @param updateData - the data of the user to update
   * @return the user with the updated data
   */
  async update({
    user_id,
    role_id,
    ...updateData
  }: UpdateUserPayload): Promise<ApiResponse<User>> {
    const user = await this.userRepository.findOneBy({
      user_id,
    })
    if (!user) {
      throw new NotFoundException('Usuario no encontrado.')
    }

    if (updateData.email && updateData.email !== user.email) {
      const userWithEmail = await this.userRepository.findOneBy({
        email: updateData.email,
      })
      if (userWithEmail) {
        throw new ConflictException('El email ya esta en uso')
      }
    }

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10)
    }

    if (role_id) {
      const role = await this.rolesRepository.findOneBy({ role_id })

      if (!role?.role_id) {
        throw new ConflictException(`Rol con id '${role_id}' no encontrado.`)
      }

      try {
        await this.userRolesRepository.insert({
          user,
          role,
          created_by: user.created_by,
          created_at: new Date(),
        })
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log({ error })
      }
    }

    const updatedUser = this.userRepository.merge(user, updateData)
    const data = await this.userRepository.save(updatedUser)

    return { data }
  }

  /**
   * Assign roles to usr
   * @param  payload - roles IDs and user info
   * @return a message
   */
  async assign_roles(payload: AssignRolePayload): Promise<ApiResponse> {
    const user = await this.userRepository.findOneBy({
      user_id: payload.user_id,
    })
    if (!user) {
      throw new NotFoundException(
        `User with id '${payload.user_id}' not found.`
      )
    }

    const userRoles = new Array<UserRoles>()
    for (const role_id of payload.roles) {
      const role = await this.rolesRepository.findOneBy({ role_id })
      if (!role) {
        throw new NotFoundException(`Role with id '${role_id}' not found.`)
      }

      userRoles.push({
        user_id: user.user_id,
        role_id,
      } as never)
    }

    const newUserRole = this.userRolesRepository.create(userRoles)
    await this.userRolesRepository.save(newUserRole)

    return { message: 'Rol assigned to user successfully.' }
  }

  /**
   * Get user info by his username
   * @param username - the name of the user
   * @returns the user info
   */
  async getUserByUsername(username: string): Promise<ApiResponse<User>> {
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['roles'],
    })

    if (!user) {
      throw new NotFoundException('Usuario no encontrado.')
    }

    delete user.password

    return { data: user }
  }

  /**
   * Get user list
   * @returns the list of users
   */
  async getUserList(
    conditions: AdvancedCondition[],
    searchParams: QueryParams
  ): Promise<ApiResponse<User[]>> {
    const { whereClause, parameters } = buildWhereClause(conditions)

    const statement = `
        SELECT * FROM (
          SELECT 
              CONCAT(U.name, ' ', U.last_name, ' ', U.username, ' ', U.identity_document, ' ', U.phone, ' ', U.email) AS filter,
              CONCAT(U.name, ' ', U.last_name) AS full_name,
              U.identity_document,
              U.email,
              U.phone,
              U.state,
              U.user_id,
              U.avatar,
              U.address,
              U.name,
              U.last_name,
              U.username,
              GROUP_CONCAT(R.name SEPARATOR ', ') AS roles
          FROM 
              USER U
          LEFT JOIN 
              USER_X_ROLES UXR ON U.user_id = UXR.user_id
          LEFT JOIN 
              ROLES R ON UXR.role_id = R.role_id AND R.state = 'A'
          GROUP BY 
              U.user_id
      ) subquery
      WHERE 
          ${whereClause}
      ORDER BY 
          user_id ASC
        `

    const [data = [], metadata] = await paginatedQuery<User>(
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
   * Let a user logged in by provide his credential and generate an JWT token
   * @param username
   * @param password
   * @return { UserSession } Object with the user info and the access token
   */
  async login(
    username: string,
    password: string
  ): Promise<ApiResponse<UserSession>> {
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['roles'],
    })
    if (!user) {
      throw new UnAuthorizedException('Usuario o contraseña incorrectos')
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user?.password as string
    )
    if (!isPasswordValid) {
      throw new UnAuthorizedException('Usuario o contraseña incorrectos')
    }

    const secret = process.env.JWT_SECRET
    if (!secret) {
      BadRequestException('JWT_SECRET no configurado')
    }

    const token = jwt.sign({ userId: user?.user_id, username }, secret, {
      expiresIn: '24h',
    })

    const expiration = new Date()
    expiration.setDate(expiration.getDate() + 1)

    const rolesNames =
      user.roles
        .filter((item) => item.state === 'A')
        .map((role) => role.name) ?? []

    return {
      data: {
        username,
        user_id: user?.user_id,
        name: `${user?.name} ${user?.last_name}`,
        avatar: user?.avatar,
        roles: rolesNames,
        sessionCookie: {
          expiration,
          token,
        },
      },
    }
  }

  /**
   * Validate if an specific field is already in use for another user
   * @param field: the database column name.
   * @param value - the value in the field
   * @return boolean
   */
  async isFieldUsed(field: keyof User, value: string): Promise<boolean> {
    const whereCondition: FindOptionsWhere<User> = { [field]: value }

    // Buscamos un usuario que tenga ese valor en el campo indicado
    const user = await this.userRepository.findOneBy(whereCondition)
    return user !== null
  }
}

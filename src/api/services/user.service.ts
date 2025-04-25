import { FindOptionsWhere, In } from 'typeorm'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { AppDataSource } from '../../config/database/ormconfig'
import { HTTP_STATUS_NO_CONTENT } from '../../constants/status-codes'
import { Role } from '../../entities/Role'
import { User } from '../../entities/User'
import { UserRoles } from '../../entities/UserXRoles'
import { buildWhereClause } from '../../helpers/build-where-clause'
import {
  ConflictException,
  NotFoundException,
  UnAuthorizedException,
  BadRequestException,
} from '../../helpers/error-api'
import { paginatedQuery } from '../../helpers/paginated-query'
import {
  ApiResponse,
  AdvancedCondition,
  QueryParams,
  SessionData,
} from '../../types/api.types'
import { generatePassword } from '../../helpers/generate-password'
import { publishEmailToQueue } from './email/email-producer.service'
import Business from 'src/entities/Business'
import PasswordResetToken from 'src/entities/PasswordResetToken'
import { randomBytes } from 'crypto'

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
  created_by: number
}

export interface ChangePasswordPayload {
  old_password: string
  new_password: string
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
  business: Business
  sessionCookie: {
    expiration: Date
    token: string
  }
}

export interface CustomerSession {
  username: string
  customer_id: number
  name: string
  sessionCookie: {
    expiration: Date
    token: string
  }
}

export class UserService {
  private userRepository = AppDataSource.getRepository(User)
  private rolesRepository = AppDataSource.getRepository(Role)
  private userRolesRepository = AppDataSource.getRepository(UserRoles)
  private resetPasswordRepository =
    AppDataSource.getRepository(PasswordResetToken)
  private manager = AppDataSource.manager

  /**
   * Register a new user
   * @param userData - user data, include username and password
   * @returns the created user
   */
  async register(
    payload: CreateUserPayload,
    session: SessionData
  ): Promise<ApiResponse<User>> {
    const { created_by, role_id, ...userData } = payload
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

    const createdBy = await this.userRepository.findOneBy({
      user_id: created_by,
    })
    if (!createdBy) {
      throw new NotFoundException(
        `Usuario con id '${created_by}' no encontrado.`
      )
    }

    const password = generatePassword()
    const hashedPassword = await bcrypt.hash(password, 10)

    return this.manager.transaction(async (entityManager) => {
      const user = entityManager.create(User, {
        ...userData,
        password: hashedPassword,
        created_by: createdBy,
      })

      await entityManager.save(user)

      if (role_id) {
        const role = await entityManager.findOneBy(Role, { role_id })

        if (!role?.role_id) {
          throw new ConflictException(`Rol with id '${role_id}' not found.`)
        }

        await entityManager.insert(UserRoles, {
          user,
          role,
          created_by: createdBy,
          created_at: new Date(),
        })
      }

      await publishEmailToQueue({
        to: userData.email,
        subject: 'Te damos la bienvenida',
        templateName: 'welcome',
        record: {
          ...user,
          password,
          business: session.business,
          url: process.env.ADMIN_APP_URL,
        },
        text: '',
      })

      return {
        data: user,
      }
    })
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
    try {
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
          console.error({ error })
        }
      }

      const updatedUser = this.userRepository.merge(user, updateData)
      const data = await this.userRepository.save(updatedUser)

      return { data }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error({ error })
    }
  }

  /**
   * change user password
   * @param username - the name of the user
   * @param payload - old password and new password
   * @return { message: 'Password changed successfully.' }
   */
  async changePassword(
    username: string,
    payload: ChangePasswordPayload
  ): Promise<ApiResponse> {
    const user = await this.userRepository.findOne({
      where: { username },
    })

    if (!user) {
      throw new NotFoundException('Usuario no encontrado.')
    }

    if (!(await bcrypt.compare(payload.old_password, user.password))) {
      throw new UnAuthorizedException('La contraseña actual no es correcta.')
    }

    user.password = await bcrypt.hash(payload.new_password, 10)
    await this.userRepository.save(user)

    return { message: 'Password changed successfully.' }
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
              U.created_at,
              U.updated_at,
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
      relations: ['roles', 'business'],
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

    const token = jwt.sign(
      { userId: user?.user_id, username, business: user.business },
      secret,
      {
        expiresIn: '24h',
      }
    )

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
        business: user?.business,
        sessionCookie: {
          expiration,
          token,
        },
      },
    }
  }

  async requestPasswordReset(
    email: string,
    username: string
  ): Promise<ApiResponse> {
    const user = await this.userRepository.findOne({
      where: { email, username },
      relations: ['business'],
    })
    if (!user) {
      throw new NotFoundException('El correo introducido no es valido.')
    }

    const token = randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 1000 * 60 * 1)

    const resetToken = this.resetPasswordRepository.create({
      user,
      token,
      expires_at: expiresAt,
    })
    await this.resetPasswordRepository.save(resetToken)

    const url = `${process.env.ADMIN_APP_URL}/reset_password/${token}?expires=${expiresAt.getTime()}`

    await publishEmailToQueue({
      to: email,
      subject: 'Recuperación de contraseña',
      templateName: 'forgot-password',
      text: '',
      record: {
        name: user.name,
        business: user.business,
        url,
        year: new Date().getFullYear(),
      },
    })

    return {
      message:
        'Hemos enviado un correo electrónico con las instrucciones para recuperar tu contraseña.',
    }
  }

  async resetPassword(token: string, password: string): Promise<ApiResponse> {
    const tokenRecord = await this.resetPasswordRepository.findOne({
      where: { token },
      relations: ['user'],
    })

    if (!tokenRecord || tokenRecord.expires_at < new Date()) {
      throw new Error('Token inválido o expirado')
    }

    const user = tokenRecord.user

    user.password = await bcrypt.hash(password, 10)
    await this.userRepository.save(user)

    await this.resetPasswordRepository.delete(tokenRecord)

    await publishEmailToQueue({
      to: user.email,
      subject: 'Recuperación de contraseña',
      templateName: 'password-changed',
      text: '',
      record: {
        name: user.name,
        business: user.business,
        url: `${process.env.ADMIN_APP_URL}/login`,
        year: new Date().getFullYear(),
      },
    })

    return {
      message:
        'Su contraseña ha sido actualizada correctamente. Ya puede iniciar sesión.',
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

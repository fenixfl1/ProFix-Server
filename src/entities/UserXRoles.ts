import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { BaseEntity } from './BaseEntity'
import { User } from './User'
import { Role } from './Role'

@Entity('USER_X_ROLES')
export class UserRoles extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User, (user) => user.roles)
  @JoinColumn({ name: 'user_id' })
  user: User

  @ManyToOne(() => Role, (role) => role.role_id)
  @JoinColumn({ name: 'role_id' })
  role: Role
}

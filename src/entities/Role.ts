import {
  Entity,
  Column,
  ManyToMany,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm'
import { BaseEntity } from './BaseEntity'
import { MenuOption } from './MenuOption'
import { UserRoles } from './UserXRoles'
import { User } from './User'

@Entity('roles')
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn()
  role_id: number

  @Column({ unique: true, length: 30, nullable: false })
  name: string

  @Column({ length: 250 })
  description: string

  @ManyToMany(() => User, (user) => user.roles)
  users: User[]

  @ManyToMany(() => MenuOption, (menuOption) => menuOption.roles)
  menu_options: MenuOption[]
}

import {
  Entity,
  Unique,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm'
import { MenuOption } from './MenuOption'
import { Role } from './Role'
import { BaseEntity } from './BaseEntity'

@Entity('MENU_OPTIONS_X_ROLES')
@Unique(['menu_option_id', 'role_id'])
export class MenuOptionRoles extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => MenuOption, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'menu_option_id' })
  menu_option_id: MenuOption | string

  @ManyToOne(() => Role, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_id' })
  role_id: Role | number
}

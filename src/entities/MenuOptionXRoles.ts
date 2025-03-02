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

@Entity('menu_options_x_roles')
@Unique(['menu_option', 'role'])
export class MenuOptionRoles extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => MenuOption, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'menu_option_id' })
  menu_option: MenuOption

  @ManyToOne(() => Role, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_id' })
  role: Role
}

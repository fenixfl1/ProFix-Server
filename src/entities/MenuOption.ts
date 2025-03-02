import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  PrimaryColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm'
import { BaseEntity } from './BaseEntity'
import { Role } from './Role'
import { Parameters } from './Parameters'

@Entity('menu_option')
export class MenuOption extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  menu_option_id: string

  @Column({ type: 'varchar', length: 100 })
  name: string

  @Column({ type: 'varchar', length: 250, nullable: true })
  description?: string

  @Column({ type: 'varchar', length: 100, nullable: true })
  path?: string

  @Column({
    type: 'enum',
    nullable: true,
    enum: ['group', 'divider', 'link'],
  })
  type?: string

  @Column({ type: 'text', nullable: true })
  icon?: string

  @Column({ nullable: false })
  order: number

  @ManyToOne(() => MenuOption, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent?: MenuOption

  @Column({ type: 'text', nullable: true })
  content?: string

  @ManyToMany(() => Role, (role) => role.menu_options)
  @JoinTable({
    name: 'MENU_OPTIONS_X_ROLES', // Nombre real de la tabla
    joinColumn: {
      name: 'menu_option_id',
      referencedColumnName: 'menu_option_id',
    },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'role_id' },
  })
  roles: Role[]

  @OneToMany(() => Parameters, (parameter) => parameter.menuOption)
  parameters: Parameters[]
}

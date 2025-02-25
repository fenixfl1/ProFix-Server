import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { MenuOption } from './MenuOption'
import { BaseEntity } from './BaseEntity'

@Entity('parameters')
export class Parameters extends BaseEntity {
  @PrimaryGeneratedColumn()
  parameter_id: number

  @Column({ length: 50, unique: true })
  name: string

  @Column('text')
  value: string

  @Column({ length: 250, nullable: true })
  description?: string

  @ManyToOne(() => MenuOption, (menuOption) => menuOption.parameters, {
    onDelete: 'CASCADE',
  })
  menuOption: MenuOption
}

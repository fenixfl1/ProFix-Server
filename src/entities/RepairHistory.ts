import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
} from 'typeorm'
import { BaseEntity } from './BaseEntity'
import { Repair } from './Repair'

@Entity('repair_history')
export class RepairHistory extends BaseEntity {
  @PrimaryGeneratedColumn()
  history_id: number

  @ManyToOne(() => Repair, (repair) => repair.history, { onDelete: 'CASCADE' })
  repair: Repair

  @Column({
    type: 'enum',
    enum: ['P', 'I', 'R', 'N'],
  })
  previous_status: string

  @Column({
    type: 'enum',
    enum: ['P', 'I', 'R', 'N'], // P: pending, I: in progress, R: repaired, N: not repaired
  })
  new_status: string

  @CreateDateColumn()
  change_date: Date
}

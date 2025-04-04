import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
} from 'typeorm'
import { BaseEntity } from './BaseEntity'
import { ProductDetail } from './ProductDetail'
import { RepairOrder } from './RepairOrder'

@Entity('repair_product')
export class RepairProduct extends BaseEntity {
  @PrimaryGeneratedColumn()
  repair_product_id: number

  @ManyToOne(() => RepairOrder, (repair) => repair.used_products)
  @JoinColumn({ name: 'repair_order_id' })
  repair: RepairOrder

  @ManyToOne(() => ProductDetail)
  @JoinColumn({ name: 'product_detail_id' })
  product: ProductDetail

  @Column()
  quantity: number
}

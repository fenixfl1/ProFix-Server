import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm'
import { BaseEntity } from './BaseEntity'
import { ProductDetail } from './ProductDetail'
import { RepairOrder } from './RepairOrder'

@Entity('repair_product')
export class RepairProduct extends BaseEntity {
  @PrimaryGeneratedColumn()
  repair_product_id: number

  @ManyToOne(() => RepairOrder, (repair) => repair.used_products)
  repair: RepairOrder

  @ManyToOne(() => ProductDetail)
  product: ProductDetail

  @Column()
  quantity: number
}

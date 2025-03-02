import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm'
import { BaseEntity } from './BaseEntity'
import { ProductDetail } from './ProductDetail'
import { Repair } from './Repair'

@Entity('repair_product')
export class RepairProduct extends BaseEntity {
  @PrimaryGeneratedColumn()
  repair_product_id: number

  @ManyToOne(() => Repair, (repair) => repair.used_products)
  repair: Repair

  @ManyToOne(() => ProductDetail)
  product: ProductDetail

  @Column()
  quantity: number
}

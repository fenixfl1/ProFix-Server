import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { ProductHeader } from './ProductHeader'
import { BaseEntity } from './BaseEntity'

@Entity('PRODUCT_DETAIL')
export class ProductDetail extends BaseEntity {
  @PrimaryGeneratedColumn()
  detail_id: number

  @ManyToOne(() => ProductHeader, (product) => product.details, {
    onDelete: 'CASCADE',
  })
  product: ProductHeader

  @Column({ length: 100 })
  model: string

  @Column({ length: 100 })
  brand: string

  @Column('decimal', { precision: 10, scale: 2 })
  price: number

  @Column('int')
  stock: number

  @Column({ length: 100 })
  supplier: string

  @Column({
    type: 'enum',
    enum: ['new_original', 'new_replica', 'used_original', 'used_replica'],
  })
  condition: 'new_original' | 'new_replica' | 'used_original' | 'used_replica'
}

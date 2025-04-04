import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { ProductHeader } from './ProductHeader'
import { BaseEntity } from './BaseEntity'

@Entity('product_detail')
export class ProductDetail extends BaseEntity {
  @PrimaryGeneratedColumn()
  product_detail_id: number

  @ManyToOne(() => ProductHeader, (product) => product.details, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
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
    enum: ['NO', 'UO', 'NR', 'UR'],
  })
  condition: 'NO' | 'UO' | 'NR' | 'UR'
}

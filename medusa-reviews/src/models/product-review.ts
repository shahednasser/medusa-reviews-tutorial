import { BeforeInsert, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm"
import { Max, Min } from "class-validator"

import { Product } from "@medusajs/medusa"
import { resolveDbType } from "@medusajs/medusa/dist/utils/db-aware-column"
import { ulid } from "ulid"

@Entity()
export class ProductReview {
  @PrimaryColumn()
  id: string

  @Index()
  @Column({ type: "varchar", nullable: true })
  product_id: string

  @ManyToOne(() => Product)
  @JoinColumn({ name: "product_id" })
  product: Product

  @Column({ type: "varchar", nullable: false })
  title: string

  @Column({ type: "varchar", nullable: false })
  user_name: string

  @Column({ type: "int" })
  @Min(1)
  @Max(5)
  rating: number

  @Column({ nullable: false })
  content: string

  @CreateDateColumn({ type: resolveDbType("timestamptz") })
  created_at: Date

  @UpdateDateColumn({ type: resolveDbType("timestamptz") })
  updated_at: Date

  @BeforeInsert()
  private beforeInsert() {
    if (this.id) return
    const id = ulid()
    this.id = `prev_${id}`
  }
}
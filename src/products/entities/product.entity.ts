import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  // @Column({ nullable: false })
  @Column() // nullable: false is the default behavior, so we can omit it
  name!: string;
  @Column({ type: 'text' })
  description!: string;
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;
  @Column({ type: 'int' })
  stock!: number;
  @Column()
  category!: string;
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}

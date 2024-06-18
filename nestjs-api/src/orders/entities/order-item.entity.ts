import { Product } from 'src/products/entities/product.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity('order_items')
export class OrderItem {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'int' })
	quantity: number;

	@Column({ type: 'decimal', precision: 10, scale: 2 })
	price: number;

	@ManyToOne(() => Product)
	@JoinColumn({ name: 'product_id' })
	product: Product;

	@Column()
	product_id: number;

	@ManyToOne(() => Order)
	order: Order;
}

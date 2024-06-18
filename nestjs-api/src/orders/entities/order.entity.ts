import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum OrderStatus {
	PENDING = 'PENDING',
	PAID = 'PAID',
	FAILED = 'FAILED',
}

@Entity('orders')
export class Order {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ type: 'decimal', precision: 10, scale: 2 })
	total: number;

	@Column()
	cliente_id: number;

	@Column()
	status: OrderStatus = OrderStatus.PENDING;

	@CreateDateColumn()
	created_at: Date;
}

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('products')
export class Product {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	name: string;

	@Column({ type: 'text' })
	description: string;

	@Column()
	image_url: string;

	@Column()
	price: number;
}

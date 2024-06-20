import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { In, Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class OrdersService {
	constructor(
		@InjectRepository(Order) private orderRepository: Repository<Order>,
		@InjectRepository(Product) private readonly productRepo: Repository<Product>,
		private amqpConnection: AmqpConnection,
	) {}

	async create(createOrderDto: CreateOrderDto & { client_id: number }) {
		const productIds = createOrderDto.items.map((item) => item.product_id);

		const uniqueProductIds = [...new Set(productIds)];

		const products = await this.productRepo.findBy({
			id: In(uniqueProductIds),
		});

		if (products.length !== uniqueProductIds.length) {
			throw new HttpException(
				`Algum produto não existe. Produtos passados ${productIds}, produtos encontrados ${products.map((product) => product.id)}	`,
				HttpStatus.UNPROCESSABLE_ENTITY,
			);
		}

		const order = Order.create({
			client_id: createOrderDto.client_id,
			items: createOrderDto.items.map((item) => {
				const product = products.find((product) => product.id === item.product_id);
				return {
					price: product.price,
					product_id: item.product_id,
					quantity: item.quantity,
				};
			}),
		});
		await this.orderRepository.save(order);
		await this.amqpConnection.publish('amq.direct', 'OrderCreated', {
			order_id: order.id,
			card_hash: createOrderDto.card_hash,
			total: order.total,
		});
		return order;
	}

	findAll(client_id: number) {
		return this.orderRepository.find({
			where: {
				client_id,
			},
			order: {
				created_at: 'DESC',
			},
		});
	}
	findOne(id: string, client_id: number) {
		return this.orderRepository.findOneByOrFail({
			id,
			client_id,
		});
	}

	async pay(id: string) {
		const order = await this.orderRepository.findOneByOrFail({
			id,
		});

		order.pay();

		await this.orderRepository.save(order);

		return order;
	}

	async fail(id: string) {
		const order = await this.orderRepository.findOneByOrFail({
			id,
		});

		order.fail();

		await this.orderRepository.save(order);

		return order;
	}
}

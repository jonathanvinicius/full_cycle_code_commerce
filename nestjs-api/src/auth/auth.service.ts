import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

const users = [
	{
		id: 1,
		username: 'john',
		password: 'john',
	},
	{
		id: 2,
		username: 'chris',
		password: 'chris',
	},
];

@Injectable()
export class AuthService {
	constructor(private jwtService: JwtService) {}

	login(username: string, password: string) {
		const user = users.find((user) => user.username === username && user.password === password);

		if (!user) {
			throw new HttpException('User not authorized', HttpStatus.UNAUTHORIZED);
		}

		const payload = { sub: user.id, username: user.username };

		return {
			access_token: this.jwtService.sign(payload),
		};
	}
}

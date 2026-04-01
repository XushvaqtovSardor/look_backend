import { ConflictException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { createUserDto } from './dto/create.user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {

  constructor(private readonly prisma: PrismaService) { }

  async createUser(payload: createUserDto) {
    try {
      const userExist = await this.prisma.user.findUnique({ where: { phone: payload.phone } });
      if (userExist) throw new ConflictException('User phone number already exists in the database');

      const newUser = await this.prisma.user.create({
        data: {
          fullname: payload.fullname,
          phone: payload.phone,
        },
      });

      return {
        success: true,
        message: `SUCCESSFULLY CREATED A NEW USER`,
        data: newUser
      };

    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }

      throw new InternalServerErrorException(err instanceof Error ? err.message : 'Unexpected error')
    }

  }
  async findAll() {
    try {
      return await this.prisma.user.findMany()
    } catch (e) {
      throw new InternalServerErrorException(e instanceof Error ? e.message : 'Unexpected error')

    }
  }

  async findById(id: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        include: {
          orders: {
            select: {
              count: true,
              food: {
                select: {
                  food_name: true,
                  food_img: true,
                },
              },
            },
          },
        },
      });

      if (!user) {
        throw new NotFoundException('NOT FOUND SUCH A USER ID!');
      }

      if (!user.orders.length) {
        return {
          id,
          user: {
            id: user.id,
            fullname: user.fullname,
            phone: user.phone,
          },
        };
      }

      const foods = user.orders.map((order) => ({
        food_name: order.food.food_name,
        food_img: order.food.food_img ? order.food.food_img.split('/').pop() : null,
        count: order.count,
      }));

      return {
        id: user.id,
        fullname: user.fullname,
        phone: user.phone,
        foods,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(error instanceof Error ? error.message : 'Unexpected error');
    }
  }

}

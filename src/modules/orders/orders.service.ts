import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { createOrderDto } from './dto/create.order.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) { }

  async createOrder(payload: createOrderDto) {
    try {
      const userExist = await this.prisma.user.findUnique({
        where: { id: payload.userId },
      });

      if (!userExist) throw new NotFoundException(`NOT FOUND SUCH A USER ID!`);

      const foodExist = await this.prisma.food.findUnique({
        where: { id: payload.foodId },
      });

      if (!foodExist) throw new NotFoundException(`NOT FOUND SUCH A FOOD ID!`);

      const existOrder = await this.prisma.order.findFirst({
        where: {
          foodId: payload.foodId,
          userId: payload.userId,
        },
      });
      let newOrder;
      if (existOrder) {
        newOrder = await this.prisma.order.update({
          where: { id: existOrder.id },
          data: {
            count: {
              increment: payload.count,
            },
          },
        });
      } else {
        newOrder = await this.prisma.order.create({
          data: {
            userId: payload.userId,
            foodId: payload.foodId,
            count: payload.count,
          },
        });
      }

      return {
        success: true,
        message: 'Order added successfully',
        data: newOrder,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(error instanceof Error ? error.message : 'Unexpected error');
    }
  }
}

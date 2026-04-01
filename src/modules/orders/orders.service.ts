import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Order } from './entities/order.entity';
import { createOrderDto } from './dto/create.order.dto';
import { User } from '../users/entities/user.entity';
import { Food } from '../foods/entities/food.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order) private readonly orderModel: typeof Order,
    @InjectModel(User) private readonly userModel: typeof User,
    @InjectModel(Food) private readonly foodModel: typeof Food,
  ) {}

  async createOrder(payload: createOrderDto) {
    try { 
      const userExist = await this.userModel.findOne({
        where: {
          id: payload.userId,
        },
      });

      if (!userExist) throw new NotFoundException(`NOT FOUND SUCH A USER ID!`);

      const foodExist = await this.foodModel.findOne({
        where: {
          id: payload.foodId,
        },
      });

      if (!foodExist) throw new NotFoundException(`NOT FOUND SUCH A FOOD ID!`);

      const existOrder = await this.orderModel.findOne({
        where: {
          foodId: payload.foodId,
          userId: payload.userId,
        },
      });
      let newOrder;
      if (existOrder) {
        // newOrder = await this.orderModel.update({
        //     count: existOrder.dataValues.count + +payload.count
        // }, {
        //     where: {
        //         id: existOrder.id
        //     }
        // })
        await existOrder.increment('count', { by: payload.count });
        newOrder = await existOrder.reload();
      } else {
        newOrder = await this.orderModel.create({
          userId: payload.userId,
          foodId: payload.foodId,
          count: payload.count,
        });
      }

      return {
        success: true,
        message: 'Order added successfully',
        data: newOrder,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}

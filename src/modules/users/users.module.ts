import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { Food } from '../foods/entities/food.entity';
import { Order } from '../orders/entities/order.entity';

@Module({
  imports:[SequelizeModule.forFeature([User, Order, Food])],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}

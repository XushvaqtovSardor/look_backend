import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { User } from '../users/entities/user.entity';
import { Food } from '../foods/entities/food.entity';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports:[SequelizeModule.forFeature([Order,User,Food])],
  controllers: [OrdersController],
  providers: [OrdersService]
})
export class OrdersModule {}

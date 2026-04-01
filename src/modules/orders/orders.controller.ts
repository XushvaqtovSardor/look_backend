import { Body, Controller, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { createOrderDto } from './dto/create.order.dto';

@Controller('orders')
export class OrdersController {
    constructor( private readonly orderService : OrdersService){}

    @Post()
    createOrder(@Body() payload: createOrderDto){
        return this.orderService.createOrder(payload)
    }
}

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Food } from './entities/food.entity';
import { CreateFoodDto } from './dto/create.food.dto';

@Injectable()
export class FoodsService {
  constructor(
    @InjectModel(Food)
    private foodModel: typeof Food
  ) {}

  async createFood(body: CreateFoodDto, fileName: string) {
    try {
      return await this.foodModel.create({
        food_name: body.food_name,
        food_img: fileName,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll() {
    return await this.foodModel.findAll();
  }
}

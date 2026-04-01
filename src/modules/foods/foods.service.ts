import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateFoodDto } from './dto/create.food.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FoodsService {
  constructor(private readonly prisma: PrismaService) { }

  async createFood(body: CreateFoodDto, fileName: string) {
    try {
      return await this.prisma.food.create({
        data: {
          food_name: body.food_name,
          food_img: fileName,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error instanceof Error ? error.message : 'Unexpected error');
    }
  }

  async findAll() {
    return await this.prisma.food.findMany();
  }
}

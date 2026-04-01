import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { createUserDto } from './dto/create.user.dto';
import { Order } from '../orders/entities/order.entity';
import { Food } from '../foods/entities/food.entity';

@Injectable()
export class UsersService {

    constructor(
     @InjectModel(User)
     private userModel : typeof User 
    ){}

    async createUser(payload : createUserDto){
        try{
            const userExist = await this.userModel.findOne({where: {phone: payload.phone}});
            if(userExist) throw new ConflictException('User phone number already exists in the database');
            const fullname = payload.fullname
            const phone = payload.phone
            const newUser = await this.userModel.create({fullname, phone})
            return {
                success: true,
                message: `SUCCESSFULLY CREATED A NEW USER`,
                data: newUser
            };

        }catch(err){
            console.log(err);
            throw new InternalServerErrorException(err)
        }

    }
    async findAll(){
        try{
            return await this.userModel.findAll()
        }catch(e){
            throw new InternalServerErrorException(e)
            
        }
    }

 async findById(id: number) {
  try {
    const orders = await Order.findAll({
      where: { userId: id },
      include: [
        { model: User, attributes: ['id', 'fullname', 'phone'] },
        { model: Food, attributes: ['food_name', 'food_img'] },
      ],
      attributes: ['count'],
      raw: true,
      nest: true,
    });
    if (!orders.length) {
      const user = await this.userModel.findOne({where: {id}});
      return {
        id,
        user:user
      }
    }
    const { id: userId, fullname, phone } = orders[0].user;

    const foods = orders.map(o => ({
      food_name: o.food.food_name,
      food_img: o.food.food_img.split("/")[1],
      count: o.count,
    })); 

    return {
      id: userId,
      fullname,
      phone,
      foods,
    };
  } catch (error) {
    console.error(error.message);
    throw new InternalServerErrorException(error.message);
  }
}

}

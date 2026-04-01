import { AllowNull, BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Food } from "src/modules/foods/entities/food.entity";
import { User } from "src/modules/users/entities/user.entity";

@Table({tableName:"orders"})

export class Order extends Model{
    @Column({
        type:DataType.INTEGER,
        autoIncrement:true,
        primaryKey:true
    })
    declare id : number

    @ForeignKey(() => User)
    @Column({
        type:DataType.INTEGER,
        allowNull:false
    })
    userId:number

    @ForeignKey(() => Food)
    @Column({
        type:DataType.INTEGER,
        allowNull:false 
    })
    foodId:number

    @Column({
        type:DataType.INTEGER,
        allowNull:false
    })
    count : number

    @BelongsTo(() => User)
    user: User;

    @BelongsTo( () => Food )
    food: Food;
}
import { BelongsToMany, Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { Food } from "src/modules/foods/entities/food.entity";
import { Order } from "src/modules/orders/entities/order.entity";

@Table({tableName:"users"})

export class User extends Model{
    @Column({
        type:DataType.INTEGER,
        autoIncrement:true,
        primaryKey:true
    })
    declare id : number

    @Column({
        type:DataType.STRING,
        allowNull:false
    })
    fullname:string

    @Column({
        type:DataType.STRING,
        allowNull:false
    })
    phone:string

    @BelongsToMany(() => Food, () => Order)
    foods: Food[]

    @HasMany(() => Order)
    orders : Order[]
}
import { BelongsToMany, Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { Order } from "src/modules/orders/entities/order.entity";
import { User } from "src/modules/users/entities/user.entity";

@Table({tableName:"foods"})

export class Food extends Model{
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
    food_name: string

    @Column({
        type:DataType.STRING,
        allowNull: true
    })
    food_img:string

    @BelongsToMany(() => User, () => Order)
    users: User[]

    @HasMany(() => Order)
    orders : Order[]
}
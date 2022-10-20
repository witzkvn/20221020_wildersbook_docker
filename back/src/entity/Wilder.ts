import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { ObjectType, Field } from "type-graphql";
import { IWilder } from "../interfaces/IWilder";
import { Grade } from "./Grade";

@ObjectType()
@Entity()
export class Wilder implements IWilder {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  city: string;

  @Field()
  @Column()
  description: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  avatar?: string;

  @Field(() => [Grade], { nullable: true })
  @OneToMany(() => Grade, (grade) => grade.wilder, {
    cascade: true,
  })
  grades?: Grade[];
}

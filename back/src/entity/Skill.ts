import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { ObjectType, Field } from "type-graphql";
import { Grade } from "./Grade";

@ObjectType()
@Entity()
export class Skill {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field(() => [Grade], { nullable: true })
  @OneToMany(() => Grade, (grade) => grade.skill, {
    cascade: true,
  })
  grades: Grade[];
}

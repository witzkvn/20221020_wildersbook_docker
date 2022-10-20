import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { ObjectType, Field } from "type-graphql";
import { Wilder } from "./Wilder";
import { Skill } from "./Skill";

@ObjectType()
@Entity()
export class Grade {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  grade: number;

  @ManyToOne(() => Wilder, (wilder) => wilder.grades, {
    onDelete: "CASCADE",
  })
  wilder: Wilder;

  @Field()
  @ManyToOne(() => Skill, (skill) => skill.grades, {
    onDelete: "CASCADE",
  })
  skill: Skill;
}

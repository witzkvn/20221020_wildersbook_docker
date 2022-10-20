import { InputType, Field } from "type-graphql";
import { Grade } from "../../entity/Grade";

@InputType({ description: "New wilder data" })
export class GradeInput {
  @Field({ nullable: true })
  id?: number;

  @Field()
  grade: number;

  @Field()
  skillId: number;

  @Field({ nullable: true })
  wilderId?: number;
}

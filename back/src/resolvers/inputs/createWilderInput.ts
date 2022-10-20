import { InputType, Field } from "type-graphql";
import { Grade } from "../../entity/Grade";
import { GradeInput } from "./gradeInput";

@InputType({ description: "New wilder data" })
export class CreateWilderInput {
  @Field()
  name: string;

  @Field()
  city: string;

  @Field()
  description: string;

  @Field(() => String, { nullable: true })
  avatar: string;

  @Field(() => [GradeInput], { nullable: true })
  grades: GradeInput[];
}

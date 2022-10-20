import { InputType, Field } from "type-graphql";
import { Grade } from "../../entity/Grade";
import { GradeInput } from "./gradeInput";

@InputType({ description: "Update wilder data" })
export class UpdateWilderInput {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  city?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  avatar?: string;

  @Field(() => [GradeInput], { nullable: true })
  grades?: GradeInput[];
}

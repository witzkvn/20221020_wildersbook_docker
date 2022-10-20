import { Skill } from "../entity/Skill";
import dataSource from "../utils";
import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { UserInputError } from "apollo-server";

@Resolver(Skill)
export class SkillResolver {
  @Query(() => [Skill])
  async getAllSkills(): Promise<Skill[]> {
    const allSkills = await dataSource.getRepository(Skill).find();
    return allSkills;
  }

  @Mutation(() => Skill)
  async createSkill(@Arg("name") name: string) {
    const createdSkill = await dataSource.getRepository(Skill).save({ name });
    return createdSkill;
  }

  @Mutation(() => Skill)
  async updateSkillById(@Arg("id") id: number, @Arg("name") name: string) {
    const updatedSkill = await dataSource
      .getRepository(Skill)
      .update({ id }, { name });

    if (updatedSkill.affected === 0) {
      throw new UserInputError("Could not update the Skill.", {
        argumentName: "id",
      });
    } else {
      return updatedSkill;
    }
  }

  @Mutation(() => String)
  async deleteSkillById(@Arg("id") id: number): Promise<string> {
    const deleted = await dataSource.getRepository(Skill).delete({ id });
    if (deleted.affected === 0) {
      throw new UserInputError("Erreur lors de la suppression", {
        argumentName: "id",
      });
    } else {
      return "Wilder deleted successfully.";
    }
  }
}

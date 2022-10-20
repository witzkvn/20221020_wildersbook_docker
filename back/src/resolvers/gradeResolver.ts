import { Grade } from "../entity/Grade";
import dataSource from "../utils";
import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { Wilder } from "../entity/Wilder";
import { Skill } from "../entity/Skill";
import { UserInputError } from "apollo-server";

@Resolver(Grade)
export class GradeResolver {
  @Query(() => [Grade])
  async getAllGrades(): Promise<Grade[]> {
    const allGrades = await dataSource.getRepository(Grade).find({
      relations: {
        skill: true,
      },
    });
    return allGrades;
  }

  @Query(() => [Grade])
  async getAllGradesForAWilder(@Arg("id") id: number): Promise<Grade[]> {
    const wilderSelected = await dataSource
      .getRepository(Wilder)
      .findOneBy({ id });

    if (wilderSelected === null) {
      throw new UserInputError("No wilder found with the provided id.", {
        argumentName: "id",
      });
    }

    const allGrades = await dataSource.getRepository(Grade).find({
      relations: {
        skill: true,
      },
      where: {
        wilder: {
          id,
        },
      },
    });
    return allGrades;
  }

  @Mutation(() => Grade)
  async createGrade(
    @Arg("wilderId") wilderId: number,
    @Arg("skillId") skillId: number,
    @Arg("grade") grade: number
  ): Promise<Grade | null> {
    const addRes = await createGradeForWilder(wilderId, skillId, grade);

    if (addRes === null) {
      throw new UserInputError("Could not create the grade.", {
        argumentsName: ["wilderId", "skillId", "grade"],
      });
    } else {
      return addRes;
    }
  }
}

export const createGradeForWilder = async (
  wilderId: number,
  skillId: number,
  grade: number
): Promise<Grade | null> => {
  const wilderToAddGrade = await dataSource
    .getRepository(Wilder)
    .findOneBy({ id: wilderId });

  const skillToAddGrade = await dataSource
    .getRepository(Skill)
    .findOneBy({ id: skillId });

  if (wilderToAddGrade === null || skillToAddGrade === null) {
    return null;
  }

  const addRes = await dataSource.getRepository(Grade).save({
    grade,
    skill: skillToAddGrade,
    wilder: wilderToAddGrade,
  });

  return addRes;
};

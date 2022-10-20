import { Wilder } from "../entity/Wilder";
import dataSource from "../utils";
import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { CreateWilderInput } from "./inputs/createWilderInput";
import { createGradeForWilder } from "./gradeResolver";
import { Grade } from "../entity/Grade";
import { IGrade } from "../interfaces/IGrade";
import { Skill } from "../entity/Skill";
import { GraphQLError } from "graphql";
import { UpdateWilderInput } from "./inputs/updateWilderInput";
import { ApolloError, UserInputError } from "apollo-server";

@Resolver(Wilder)
export class WilderResolver {
  @Query(() => [Wilder])
  async getAllWilders(): Promise<Wilder[]> {
    const allWilders = await dataSource.getRepository(Wilder).find({
      relations: {
        grades: {
          skill: true,
        },
      },
    });
    return allWilders;
  }

  @Mutation(() => Wilder)
  async createWilder(
    @Arg("data") newWilder: CreateWilderInput
  ): Promise<Wilder> {
    const createdWilder = await dataSource.getRepository(Wilder).save({
      name: newWilder.name,
      city: newWilder.city,
      description: newWilder.description,
      avatar: newWilder.avatar,
    });

    let isNotFoundAndBreak = false;
    if (
      newWilder.grades !== null &&
      newWilder.grades !== undefined &&
      newWilder.grades.length > 0
    ) {
      for (const grade of newWilder.grades) {
        const addRes = await createGradeForWilder(
          createdWilder.id,
          grade.skillId,
          grade.grade
        );

        if (addRes === null) {
          isNotFoundAndBreak = true;
          break;
        }
      }
    }

    if (isNotFoundAndBreak) {
      throw new UserInputError(
        "No wilder or skill found with the provided IDs to create the grade."
      );
    }

    return createdWilder;
  }

  @Mutation(() => Wilder)
  async updateWilder(
    @Arg("updateWilderId") updateWilderId: number,
    @Arg("data") updateWilder: UpdateWilderInput
  ): Promise<Wilder | ApolloError> {
    const updatedWilder = await dataSource.getRepository(Wilder).update(
      { id: updateWilderId },
      {
        name: updateWilder.name,
        city: updateWilder.city,
        description: updateWilder.description,
        avatar: updateWilder.avatar,
      }
    );

    if (updatedWilder.affected === 0) {
      throw new UserInputError("Could not update the Wilder.", {
        argumentName: "id",
      });
    }

    const wilderGradesInDb = await dataSource.getRepository(Grade).find({
      where: {
        wilder: {
          id: updateWilderId,
        },
      },
      select: {
        id: true,
      },
    });

    const wilder = await dataSource
      .getRepository(Wilder)
      .findOneBy({ id: updateWilderId });

    if (wilder === null) {
      throw new ApolloError("No Wilder found with that id.");
    }

    if (updateWilder.grades !== null && updateWilder.grades !== undefined) {
      // delete grades not present in req.body.grades
      const bodyGradesIds: (number | undefined)[] = updateWilder.grades.map(
        (el) => el.id
      );
      const wilderGradesIds: number[] = wilderGradesInDb.map((el) => el.id);
      const gradeIdsToDelete: number[] = wilderGradesIds.filter(
        (id) => !bodyGradesIds.includes(id)
      );

      gradeIdsToDelete.forEach(async (grade) => {
        await dataSource.getRepository(Grade).delete(grade);
      });

      await Promise.all(
        updateWilder.grades.map(async (gradeToAdd) => {
          // get the existing grades for the wilder
          const existingGrade = await dataSource.getRepository(Grade).findOne({
            where: {
              skill: {
                id: gradeToAdd.skillId,
              },
              wilder: {
                id: updateWilderId,
              },
            },
          });

          // verify if skill exists in DB
          const newSkill = await dataSource
            .getRepository(Skill)
            .findOneBy({ id: gradeToAdd.skillId });

          if (newSkill === null) {
            throw new UserInputError("The new skill could not be found.", {
              argumentName: "id",
            });
          } else if (existingGrade !== null) {
            // grade already exists : UPDATE
            existingGrade.grade = gradeToAdd.grade;
            existingGrade.skill.id = newSkill?.id;
            await dataSource.getRepository(Grade).save(existingGrade);
          } else {
            // grade does not exists : CREATE
            const newGrade = new Grade();
            newGrade.grade = gradeToAdd.grade;
            newGrade.skill = newSkill;
            newGrade.wilder = wilder;
            await dataSource.getRepository(Grade).save(newGrade);
          }
        })
      );
    } else {
      throw new ApolloError("Error while updating the Wilder.");
    }
    return wilder;
  }

  @Mutation(() => String)
  async deleteWilderById(@Arg("id") id: number): Promise<string> {
    const deleted = await dataSource.getRepository(Wilder).delete({ id });
    if (deleted.affected === 0) {
      throw new UserInputError("Erreur lors de la suppression", {
        argumentName: "id",
      });
    } else {
      return "Wilder deleted successfully.";
    }
  }
}

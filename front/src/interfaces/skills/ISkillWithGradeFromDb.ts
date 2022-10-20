import ISkillFromDb from "./ISkillFromDB";

export default interface IGradeFromDb {
  id: number;
  grade: number;
  skill: ISkillFromDb;
}

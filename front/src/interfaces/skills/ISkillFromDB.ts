import IGradeFromDb from "./ISkillWithGradeFromDb";

export default interface ISkillFromDb {
  id: number;
  name: string;
  grades: IGradeFromDb[];
}

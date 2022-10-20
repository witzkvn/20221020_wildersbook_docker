import ISkillWithGrade from "./ISkillWithGrade";

export interface IGrade {
  id?: number;
  name: string;
  grades: number;
  skill?: ISkillWithGrade[];
}

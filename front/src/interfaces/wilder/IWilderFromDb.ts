import IGradeFromDb from "../skills/ISkillWithGradeFromDb";

export default interface IWilderFromDb {
  id: number;
  city?: string;
  description: string;
  name: string;
  avatar?: string;
  grades: IGradeFromDb[];
}

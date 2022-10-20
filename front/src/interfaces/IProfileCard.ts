import IWilderGrades from "./IWilderGrades";

export default interface IProfileCard {
  id: number;
  name: string;
  city?: string;
  description: string;
  skills: IWilderGrades[];
  setNeedUpdateAfterCreation: (value: boolean) => void;
}

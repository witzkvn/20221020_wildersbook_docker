import ISkillAvailable from "../skills/ISkillAvailable";

export default interface IAddSkillInput {
  skillsAvailable: ISkillAvailable[];
  handleAddSkill: (skillId: number, skillGrades: number) => void;
}

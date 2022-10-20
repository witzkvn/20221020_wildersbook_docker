import { IGradeInput } from "../interfaces/grades/IGradeInput";
import ISkillWithGrade from "../interfaces/skills/ISkillWithGrade";

const setGradesAddedToGradeInput = (
  gradesAdded: ISkillWithGrade[],
  wilderId?: number
): IGradeInput[] => {
  const transformedArray: IGradeInput[] = gradesAdded.map((grade) => {
    return {
      grade: grade.grade,
      skillId: grade.skillId,
      wilderId: wilderId ?? undefined,
    };
  });

  return transformedArray;
};

export default setGradesAddedToGradeInput;

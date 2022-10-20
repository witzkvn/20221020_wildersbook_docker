import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styles from "./add-wilder.module.css";
import IAddSkillInput from "../../interfaces/form/IAddSkillInput";

const AddSkillInput = ({ skillsAvailable, handleAddSkill }: IAddSkillInput) => {
  const [selectedSkill, setSelectedSkill] = useState<number>();
  const [skillGrades, setSkillGrades] = useState(0);

  useEffect(() => {
    skillsAvailable[0] && setSelectedSkill(skillsAvailable[0].id);
  }, [skillsAvailable]);

  const handleAdd = () => {
    if (selectedSkill) {
      handleAddSkill(selectedSkill, skillGrades);
      setSelectedSkill(skillsAvailable[0]?.id);
      setSkillGrades(0);
    }
  };

  return (
    <div className={styles.skillSelectWrapper}>
      <select
        name="skill"
        id="skill"
        value={selectedSkill}
        className="input"
        onChange={(e) => setSelectedSkill(parseInt(e.target.value))}
      >
        {skillsAvailable &&
          skillsAvailable.map((skill) => (
            <option key={skill.id} value={skill.id}>
              {skill.name}
            </option>
          ))}
      </select>
      <input
        className="input"
        type="number"
        name="grades"
        id="grades"
        min="0"
        max="10"
        value={skillGrades}
        onChange={(e) => setSkillGrades(parseInt(e.target.value))}
      />
      <button
        type="button"
        onClick={handleAdd}
        className={`button cancelBtn ${styles.addSkillButton}`}
      >
        Add Skill
      </button>
    </div>
  );
};

AddSkillInput.propTypes = {
  skillsAvailable: PropTypes.array,
  handleAddSkill: PropTypes.func,
};

export default AddSkillInput;

import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import PropTypes from "prop-types";
import styles from "./add-wilder.module.css";
import AddSkillInput from "./add-skill-input";
import IAddWilderForm from "../../interfaces/form/IAddWilderForm";
import ISkill from "../../interfaces/skills/ISkill";
import ISkillWithGrade from "../../interfaces/skills/ISkillWithGrade";
import ISkillAvailable from "../../interfaces/skills/ISkillAvailable";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { UPDATE_WILDER } from "../../graphql/mutations/updateWilder";
import { GET_ALL_WILDERS } from "../../graphql/queries/getAllWilders";
import { CREATE_WILDER } from "../../graphql/mutations/createWilder";
import { GET_ALL_SKILLS } from "../../graphql/queries/getAllSkills";
import setGradesAddedToGradeInput from "../../utils/gradesAddedToGradeInput";

type WilderInputs = {
  name: string;
  description: string;
  city: string;
  avatar: Blob[];
};

const AddWilder = ({ wilderToEdit, setWilderToEdit }: IAddWilderForm) => {
  const [skillsAvailable, setSkillsAvailable] = useState<ISkillAvailable[]>([]);
  const [gradesAdded, setGradesAdded] = useState<ISkillWithGrade[]>([]);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<WilderInputs>();
  const [updateWilder, { error: updateError }] = useMutation(UPDATE_WILDER);
  const [createWilder, { error: createError }] = useMutation(CREATE_WILDER);
  const {
    loading: skillsLoading,
    error: skillsError,
    data: skillsData,
  } = useQuery(GET_ALL_SKILLS);

  let navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/add-wilder" && setWilderToEdit) {
      setWilderToEdit(null);
    }
  }, [location, setWilderToEdit]);

  const onSubmit: SubmitHandler<WilderInputs> = async (data) => {
    if (!data.name || !data.description) return;

    // upload file to cloudinary
    const file = data.avatar[0];
    let imageUrl = "";

    if (file) {
      const formData = new FormData();
      formData.set("file", file);
      formData.set("upload_preset", "pxyogsub");

      const cloudinaryUploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const res = await cloudinaryUploadResponse.json();

      imageUrl = res.secure_url;
    } else if (wilderToEdit?.avatar) {
      imageUrl = wilderToEdit.avatar;
    }

    if (wilderToEdit !== null && wilderToEdit !== undefined) {
      // edit call
      const formattedGrades = setGradesAddedToGradeInput(
        gradesAdded,
        wilderToEdit.id
      );
      const patchBody = {
        data: {
          name: data.name,
          description: data.description,
          city: data.city,
          grades: formattedGrades,
          avatar: imageUrl,
        },
        updateWilderId: wilderToEdit.id,
      };

      await updateWilder({
        variables: patchBody,
        refetchQueries: [{ query: GET_ALL_WILDERS }],
      });

      setGradesAdded([]);
      reset();
      navigate("/");
    } else {
      // create call
      const formattedGrades = setGradesAddedToGradeInput(gradesAdded);
      const createBody = {
        data: {
          name: data.name,
          city: data.city,
          description: data.description,
          avatar: imageUrl,
          grades: formattedGrades,
        },
      };

      await createWilder({
        variables: createBody,
        refetchQueries: [{ query: GET_ALL_WILDERS }],
      });

      setGradesAdded([]);
      reset();
      navigate("/");
    }
  };

  useEffect(() => {
    if (!skillsLoading && skillsData.getAllSkills) {
      const skillsState = skillsData.getAllSkills.map((skill: ISkill) => {
        return {
          id: skill.id,
          name: skill.name,
          selected: false,
          grades: 0,
        };
      });
      setSkillsAvailable(skillsState);
    }
  }, [skillsData, skillsError, skillsLoading]);

  useEffect(() => {
    if (wilderToEdit === null || wilderToEdit === undefined) {
      reset();
    } else {
      window.scrollTo(0, 0);
      setValue("name", wilderToEdit.name);
      setValue("description", wilderToEdit.description);
      wilderToEdit.city
        ? setValue("city", wilderToEdit.city)
        : setValue("city", "");
      const formattedGrades: ISkillWithGrade[] = wilderToEdit.grades.map(
        (grade) => {
          return {
            skillId: grade.skill.id,
            name: grade.skill.name,
            grade: grade.grade,
          };
        }
      );
      setGradesAdded(formattedGrades);
    }
  }, [reset, setValue, wilderToEdit]);

  const handleAddSkill = (skillId: number, grade: number) => {
    const isSkillAlreadySet = gradesAdded.some(
      (skill) => skill.skillId === skillId
    );
    if (isSkillAlreadySet) return;

    const skillToAdd = skillsAvailable.find(
      (skill: ISkill) => skill.id === skillId
    );

    if (skillToAdd) {
      const skillName: string = skillToAdd.name;
      setGradesAdded((prev) => {
        return [
          ...prev,
          {
            skillId,
            name: skillName,
            grade,
          },
        ];
      });
    }
  };

  const handleDeleteSkill = (index: number) => {
    setGradesAdded((prev) => {
      const updatedState = [...prev];
      updatedState.splice(index, 1);
      return updatedState;
    });
  };

  const handleCancelEdit = () => {
    reset();
    if (setWilderToEdit) setWilderToEdit(null);
    navigate("/");
  };

  return (
    <div className="formWrapper">
      <h3>{wilderToEdit === null ? "Create New Wilder" : "Edit the Wilder"}</h3>
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <label className="label" htmlFor="name">
          Name:
        </label>
        <input
          className="input"
          type="text"
          id="name"
          {...register("name", { required: true })}
        />
        <br />
        <label className="label" htmlFor="city">
          City:
        </label>
        <input
          className="input"
          type="text"
          id="city"
          {...register("city", { required: false })}
        />
        <br />
        <label className="label" htmlFor="avatar">
          Upload a picture for your avatar:
        </label>
        {wilderToEdit && wilderToEdit.avatar && (
          <>
            <p className={styles.currentAvatarText}>Your current avatar:</p>
            <img
              className={styles.avatarPreview}
              src={wilderToEdit.avatar}
              alt={`${wilderToEdit.name}'s avatar`}
            />
          </>
        )}
        <input {...register("avatar")} type="file" className="input" />
        <br />
        <label className="label" htmlFor="description">
          Description:
        </label>
        <textarea
          className="input textarea"
          id="description"
          {...register("description", { required: true })}
        ></textarea>
        <br />
        <div>
          {gradesAdded && gradesAdded.length > 0 ? (
            <>
              <h3>Skills added</h3>
              {gradesAdded.map((skill, index) => (
                <div key={index} className={styles.skillInput}>
                  <p>
                    {skill.name} {skill.grade}/10
                  </p>
                  <button
                    className="button whiteBtn"
                    type="button"
                    onClick={() => handleDeleteSkill(index)}
                  >
                    Delete Skill
                  </button>
                </div>
              ))}
            </>
          ) : (
            "No skill added yet"
          )}
          <AddSkillInput
            skillsAvailable={skillsAvailable}
            handleAddSkill={handleAddSkill}
          />
        </div>
        <br />
        {Object.keys(errors).length !== 0 && (
          <span className="error">
            An error occured. Please watch again all your inputs before sending
            the form.
          </span>
        )}
        {(updateError || createError) && (
          <span className="error">
            An error occured while sending the form. Please try again.
          </span>
        )}
        <br />
        {wilderToEdit !== null ? (
          <div className="button-wrapper-right">
            <button
              className="button cancelBtn"
              type="button"
              onClick={handleCancelEdit}
            >
              Cancel Edit
            </button>
            <button type="submit" className="button">
              Update Wilder
            </button>
          </div>
        ) : (
          <button type="submit" className="button button-right">
            Add Wilder
          </button>
        )}
      </form>
    </div>
  );
};

AddWilder.propTypes = {
  setNeedUpdateAfterCreation: PropTypes.func,
};

export default AddWilder;

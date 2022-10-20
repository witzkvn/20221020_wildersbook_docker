import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { ADD_SKILL } from "../../graphql/mutations/addSkill";
import { GET_ALL_SKILLS } from "../../graphql/queries/getAllSkills";

type SkillInputs = {
  name: string;
};

const AddSkill = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SkillInputs>();
  let navigate = useNavigate();
  const [addSkill, { data, loading, error }] = useMutation(ADD_SKILL);

  const onSubmit: SubmitHandler<SkillInputs> = async (data) => {
    await addSkill({
      variables: { name: data.name },
      refetchQueries: [{ query: GET_ALL_SKILLS }],
    });
    reset();
    navigate("/");
  };

  return (
    <div className="formWrapper">
      <h3>Create New Skill</h3>
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <label className="label" htmlFor="name">
          Skill name:
        </label>
        <input className="input" {...register("name", { required: true })} />
        <br />
        {Object.keys(errors).length !== 0 && (
          <span className="error">This field is required</span>
        )}
        {error && (
          <span className="error">
            An error occured while sending the data to the server.
          </span>
        )}
        <button type="submit" className="button button-right">
          Create New Skill
        </button>
      </form>
    </div>
  );
};

export default AddSkill;

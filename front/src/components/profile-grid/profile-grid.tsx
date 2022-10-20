import IWildersGrid from "../../interfaces/wilder/IWildersGrid";
import ProfileCard from "../profile-card/profile-card";

const ProfileGrid = ({ wilders, setWilderToEdit }: IWildersGrid) => {
  return (
    <>
      <h2>Wilders</h2>
      <section className="card-row section">
        {wilders && typeof setWilderToEdit !== "undefined"
          ? wilders.map((wilder, index) => (
              <ProfileCard
                key={wilder?.id || index}
                id={wilder.id}
                name={wilder.name}
                city={wilder.city}
                avatar={wilder.avatar}
                description={wilder.description}
                grades={wilder.grades}
                wilderObj={wilder}
                setWilderToEdit={setWilderToEdit}
              />
            ))
          : "Please add wilders"}
      </section>
    </>
  );
};

export default ProfileGrid;

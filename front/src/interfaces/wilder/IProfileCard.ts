import IWilderFromDb from "./IWilderFromDb";

export default interface IProfileCard extends IWilderFromDb {
  wilderObj: IWilderFromDb;
  setWilderToEdit: React.Dispatch<React.SetStateAction<IWilderFromDb | null>>;
}

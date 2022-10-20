import IWilderFromDb from "./IWilderFromDb";

export default interface IWildersGrid {
  wilders: IWilderFromDb[];
  setWilderToEdit?: React.Dispatch<React.SetStateAction<IWilderFromDb | null>>;
}

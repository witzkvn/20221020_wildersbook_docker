import React from "react";
import IWilderFromDb from "../wilder/IWilderFromDb";

export default interface IAddWilderForm {
  wilderToEdit?: IWilderFromDb | null;
  setWilderToEdit?: React.Dispatch<React.SetStateAction<IWilderFromDb | null>>;
}

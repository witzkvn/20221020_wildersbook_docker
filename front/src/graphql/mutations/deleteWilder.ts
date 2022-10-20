import { gql } from "@apollo/client";

export const DELETE_WILDER = gql`
  mutation DeleteWilderById($deleteWilderByIdId: Float!) {
    deleteWilderById(id: $deleteWilderByIdId)
  }
`;

import { gql } from "@apollo/client";

export const UPDATE_WILDER = gql`
  mutation UpdateWilder($data: UpdateWilderInput!, $updateWilderId: Float!) {
    updateWilder(data: $data, updateWilderId: $updateWilderId) {
      id
    }
  }
`;

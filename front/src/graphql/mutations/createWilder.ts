import { gql } from "@apollo/client";

export const CREATE_WILDER = gql`
  mutation CreateWilder($data: CreateWilderInput!) {
    createWilder(data: $data) {
      id
      name
    }
  }
`;

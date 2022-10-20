import { gql } from "@apollo/client";

export const ADD_SKILL = gql`
  mutation CreateSkill($name: String!) {
    createSkill(name: $name) {
      name
      id
    }
  }
`;

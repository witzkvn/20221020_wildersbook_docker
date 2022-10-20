import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import dataSource from "./utils";
import { buildSchema } from "type-graphql";
import { WilderResolver } from "./resolvers/wilderResolver";
import { SkillResolver } from "./resolvers/skillResolver";
import { GradeResolver } from "./resolvers/gradeResolver";

const port = 5000;

async function start(): Promise<void> {
  try {
    await dataSource.initialize();

    const schema = await buildSchema({
      resolvers: [WilderResolver, SkillResolver, GradeResolver],
    });
    const server = new ApolloServer({ schema });

    try {
      const { url }: { url: string } = await server.listen({ port });
      console.log(`🚀  Server ready at ${url}`);
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log("Error while launching the server");
    console.log(error);
  }
}

start();

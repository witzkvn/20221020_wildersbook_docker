import { DataSource } from "typeorm";
import { Wilder } from "./entity/Wilder";
import { Grade } from "./entity/Grade";
import { Skill } from "./entity/Skill";

const dataSource = new DataSource({
  type: "postgres",
  host: "db",
  port: 5432,
  username: "postgres",
  password: "example",
  database: "postgres",
  synchronize: true,
  entities: [Wilder, Skill, Grade],
  // logging: ["query", "error"],
});

export default dataSource;

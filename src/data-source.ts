import "reflect-metadata"
import {DataSource} from "typeorm"
import {Material, User} from "./entities";

export const AppDataSource = new DataSource({
  //unit test can't load env
  url: process.env.DATABASE_URL,
  type: "postgres",
  synchronize: true,
  logging: false,
  entities: [User, Material],
  migrations: [],
  subscribers: [],
})

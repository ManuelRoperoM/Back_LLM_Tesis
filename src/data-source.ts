import "reflect-metadata";
import { DataSource } from "typeorm";
import { Tesis } from "./upload-tesis/entites/tesis.entity";
import { User } from "./user/entities/user.entity";
import { ChunkTesis } from "./upload-tesis/entites/chunks-tesis.entity";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.HOST,
  port: parseInt(process.env.PORT),
  username: process.env.USER_DB,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  synchronize: false,
  logging: true,
  entities: [Tesis, User, ChunkTesis],
  migrations: ["src/migrations/*{.ts,.js}"],
});

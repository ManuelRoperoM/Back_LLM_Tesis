import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { Tesis } from "src/upload-tesis/entites/tesis.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, Tesis])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}

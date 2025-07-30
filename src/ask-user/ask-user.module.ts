import { Module } from "@nestjs/common";
import { AskUserService } from "./ask-user.service";
import { AskUserController } from "./ask-user.controller";
import { EmbeddingService } from "src/embedding/embedding.service";

@Module({
  providers: [AskUserService, EmbeddingService],
  controllers: [AskUserController],
})
export class AskUserModule {}

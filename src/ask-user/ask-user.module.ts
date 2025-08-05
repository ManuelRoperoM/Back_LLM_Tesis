import { Module } from "@nestjs/common";
import { AskUserService } from "./ask-user.service";
import { AskUserController } from "./ask-user.controller";
import { EmbeddingService } from "src/embedding/embedding.service";
import { LlmModule } from "src/llm/llm.module";

@Module({
  imports: [LlmModule],
  providers: [AskUserService, EmbeddingService],
  controllers: [AskUserController],
})
export class AskUserModule {}

import { Module } from "@nestjs/common";
import { AskUserService } from "./ask-user.service";
import { AskUserController } from "./ask-user.controller";
import { EmbeddingService } from "src/embedding/embedding.service";
import { LlmModule } from "src/llm/llm.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChunkTesis } from "src/upload-tesis/entites/chunks-tesis.entity";
import { Tesis } from "src/upload-tesis/entites/tesis.entity";

@Module({
  imports: [LlmModule, TypeOrmModule.forFeature([ChunkTesis, Tesis])],
  providers: [AskUserService, EmbeddingService],
  controllers: [AskUserController],
})
export class AskUserModule {}

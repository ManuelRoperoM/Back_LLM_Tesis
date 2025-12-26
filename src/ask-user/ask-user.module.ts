import { Module } from "@nestjs/common";
import { AskUserService } from "./ask-user.service";
import { AskUserController } from "./ask-user.controller";
import { EmbeddingService } from "src/embedding/embedding.service";
import { LLMModule } from "src/llm/llm.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChunkTesis } from "src/upload-tesis/entites/chunks-tesis.entity";
import { Tesis } from "src/upload-tesis/entites/tesis.entity";
import { Conversation } from "src/conversation/entities/conversation.entity";

@Module({
  imports: [
    LLMModule,
    TypeOrmModule.forFeature([ChunkTesis, Tesis, Conversation]),
  ],
  providers: [AskUserService, EmbeddingService],
  controllers: [AskUserController],
})
export class AskUserModule {}

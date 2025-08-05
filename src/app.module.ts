import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UploadTesisModule } from "./upload-tesis/upload-tesis.module";
import { EmbeddingService } from "./embedding/embedding.service";
import { EmbeddingModule } from "./embedding/embedding.module";
import { ConfigModule } from "@nestjs/config";
import { AskUserModule } from "./ask-user/ask-user.module";
import { LlmModule } from "./llm/llm.module";

@Module({
  imports: [
    UploadTesisModule,
    EmbeddingModule,
    AskUserModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LlmModule,
  ],
  controllers: [AppController],
  providers: [AppService, EmbeddingService],
})
export class AppModule {}

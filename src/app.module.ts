import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UploadTesisModule } from "./upload-tesis/upload-tesis.module";
import { EmbeddingService } from "./embedding/embedding.service";
import { EmbeddingModule } from "./embedding/embedding.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    UploadTesisModule,
    EmbeddingModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, EmbeddingService],
})
export class AppModule {}

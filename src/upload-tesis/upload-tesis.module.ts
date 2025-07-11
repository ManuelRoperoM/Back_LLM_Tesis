import { Module } from "@nestjs/common";
import { UploadTesisController } from "./upload-tesis.controller";
import { UploadTesisService } from "./upload-tesis.service";
import { EmbeddingService } from "src/embedding/embedding.service";

@Module({
  controllers: [UploadTesisController],
  providers: [UploadTesisService, EmbeddingService],
})
export class UploadTesisModule {}

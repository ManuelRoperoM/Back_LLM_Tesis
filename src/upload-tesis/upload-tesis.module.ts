import { Module } from "@nestjs/common";
import { UploadTesisController } from "./upload-tesis.controller";
import { UploadTesisService } from "./upload-tesis.service";
import { EmbeddingService } from "src/embedding/embedding.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Tesis } from "./entites/tesis.entity";

@Module({
  controllers: [UploadTesisController],
  providers: [UploadTesisService, EmbeddingService],
  imports: [TypeOrmModule.forFeature([Tesis])],
})
export class UploadTesisModule {}

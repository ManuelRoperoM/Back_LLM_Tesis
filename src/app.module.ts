import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UploadTesisModule } from './upload-tesis/upload-tesis.module';
import { EmbeddingService } from './embedding/embedding.service';
import { EmbeddingModule } from './embedding/embedding.module';

@Module({
  imports: [UploadTesisModule, EmbeddingModule],
  controllers: [AppController],
  providers: [AppService, EmbeddingService],
})
export class AppModule {}

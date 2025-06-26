import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UploadTesisModule } from './upload-tesis/upload-tesis.module';

@Module({
  imports: [UploadTesisModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

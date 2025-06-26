import { Module } from '@nestjs/common';
import { UploadTesisController } from './upload-tesis.controller';
import { UploadTesisService } from './upload-tesis.service';

@Module({
  controllers: [UploadTesisController],
  providers: [UploadTesisService]
})
export class UploadTesisModule {}

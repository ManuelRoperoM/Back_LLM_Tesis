import { Controller, Get, Param } from "@nestjs/common";
import { UploadTesisService } from "./upload-tesis.service";
@Controller("upload-tesis")
export class UploadTesisController {
  constructor(private readonly uploadTesisService: UploadTesisService) {}

  @Get(":nameFile")
  async processFile(@Param("nameFile") file: string) {
    return this.uploadTesisService.extraerTexto(file);
  }
}

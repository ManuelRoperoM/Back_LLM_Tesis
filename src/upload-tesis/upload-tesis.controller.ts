import { Body, Controller, Post } from "@nestjs/common";
import { UploadTesisService } from "./upload-tesis.service";
@Controller("upload-tesis")
export class UploadTesisController {
  constructor(private readonly uploadTesisService: UploadTesisService) {}

  @Post()
  async processFile(
    @Body() body: { nameFile: string; idUser: number; title: string },
  ) {
    const { nameFile, idUser, title } = body;
    return this.uploadTesisService.saveTesis(nameFile, idUser, title);
  }
}

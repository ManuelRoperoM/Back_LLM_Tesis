import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { diskStorage } from "multer";
import { FileInterceptor } from "@nestjs/platform-express";
// import path, { extname } from "path";
import * as path from "path";
import { extname } from "path";
import { UploadTesisService } from "./upload-tesis.service";
@Controller("upload-tesis")
export class UploadTesisController {
  constructor(private readonly uploadTesisService: UploadTesisService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: path.join(process.cwd(), "dataset/tesis"),
        filename: (req, file, callback) => {
          const uniqueSuffix =
            path.parse(file.originalname).name + "-" + Date.now();
          callback(
            null,
            `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
          );
        },
      }),
    }),
  )
  async processFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { idUser: number; title: string },
  ) {
    if (!file) {
      throw new Error("No se recibió ningún archivo");
    }
    const { idUser, title } = body;
    const nameFile = file.filename;
    return this.uploadTesisService.saveTesis(nameFile, idUser, title);
  }
}

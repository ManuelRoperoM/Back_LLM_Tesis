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
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";

@ApiTags("Tesis")
@Controller("upload-tesis")
export class UploadTesisController {
  constructor(private readonly uploadTesisService: UploadTesisService) {}

  @Post()
  @ApiOperation({
    summary: "Subir archivo de tesis",
    description:
      "Carga un archivo de tesis en formato PDF y registra su información en el sistema",
  })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
          description: "Archivo PDF de la tesis",
        },
        idUser: {
          type: "number",
          example: 3,
        },
        title: {
          type: "string",
          example: "Medición de potencia eléctrica usando ESP32",
        },
      },
      required: ["file", "idUser", "title"],
    },
  })
  @ApiOkResponse({
    description: "trabajo de grado cargado exitosamente",
    example: {
      id: 12,
      title: "Medición de potencia eléctrica usando ESP32",
      file: "file-file-1706870123456.pdf",
    },
  })
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
    @UploadedFile() file: any,
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

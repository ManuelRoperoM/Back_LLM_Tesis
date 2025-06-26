import { Injectable } from "@nestjs/common";
import * as path from "path";
import * as fs from "fs";
import * as pdfParse from "pdf-parse";

@Injectable()
export class UploadTesisService {
  private readonly pdfFolderPath = path.join(__dirname, "../../../../uploads");
  //   console.log("La ruta es : ", pdfFolderPath);

  async extraerTexto(nombreArchivo: string): Promise<string> {
    const filePath = path.join(this.pdfFolderPath, nombreArchivo);

    console.log("Esta ruta es: ", filePath);

    if (!fs.existsSync(filePath)) {
      throw new Error("Archivos no encontrado");
    }

    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);
    return data.text;
  }
}

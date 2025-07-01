import { Injectable } from "@nestjs/common";
import * as path from "path";
import * as fs from "fs";
import * as pdfParse from "pdf-parse";

@Injectable()
export class UploadTesisService {
  private readonly pdfFolderPath = path.join(__dirname, "../../../../uploads");
  //   console.log("La ruta es : ", pdfFolderPath);

  async extraerTexto(nombreArchivo: string): Promise<any> {
    const filePath = path.join(this.pdfFolderPath, nombreArchivo);

    console.log("Esta ruta es: ", filePath);

    if (!fs.existsSync(filePath)) {
      throw new Error("Archivos no encontrado");
    }
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);
    const fullText = data.text;
    const chunks = this.chunkText(fullText, 5000);
    return chunks;
  }

  chunkText(text: string, chunkSize: number): any {
    const chunks = {};
    let chunk = 1;
    for (let i = 0; i < text.length; i += chunkSize) {
      const texto = text.slice(i, i + chunkSize);
      chunks[`chunk_${chunk}`] = {
        chunk: chunk.toString(),
        texto,
      };
      chunk++;
    }
    return chunks;
  }
}

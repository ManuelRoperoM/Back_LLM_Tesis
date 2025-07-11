import { Injectable } from "@nestjs/common";
import * as path from "path";
import * as fs from "fs";
import * as pdfParse from "pdf-parse";
import rake from "rake-js";
import { EmbeddingService } from "src/embedding/embedding.service";
import { encoding_for_model } from "tiktoken";

@Injectable()
export class UploadTesisService {
  constructor(private readonly embeddingService: EmbeddingService) {}
  private readonly pdfFolderPath = path.join(__dirname, "../../../../uploads");
  async extraerTexto(nombreArchivo: string): Promise<any> {
    const filePath = path.join(this.pdfFolderPath, nombreArchivo);
    if (!fs.existsSync(filePath)) {
      throw new Error("Archivos no encontrado");
    }
    // Extraer texto del pdf:
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);
    const rawText = data.text;
    const text: string = this.cleanText(rawText);
    const chunks = this.chunkText(text, 200);
    return chunks;
  }

  //Metodos upload services

  private chunkText(text: string, maxTokens: number): any {
    const modelName = "gpt-3.5-turbo";
    const overlap: number = 50;
    const encoder = encoding_for_model(modelName);
    const tokens = encoder.encode(text);
    const chunks = {};
    let chunk = 1;

    let start = 0;

    while (start < tokens.length) {
      const end = Math.min(start + maxTokens, tokens.length);
      const chunkTokens = tokens.slice(start, end);
      const chunkText = new TextDecoder().decode(encoder.decode(chunkTokens));
      chunks[`chunk_${chunk}`] = {
        chunk: chunk.toString(),
        texto: chunkText,
      };

      start += maxTokens - overlap; // mueve la ventana con solapamiento
      chunk++;
    }
    encoder.free();
    return chunks;
  }

  private applyRake(chunks: Record<string, { chunk: string; texto: string }>) {
    const resultados: Record<
      string,
      { chunk: string; texto; keywords: string[] }
    > = {};
    for (const [clave, valor] of Object.entries(chunks)) {
      const texto = valor.texto;
      const keywords = rake(texto);
      resultados[clave] = {
        chunk: valor.chunk,
        texto: valor.texto,
        keywords,
      };
    }

    return resultados;
  }
  private cleanText(text: string): string {
    const cleanText = text
      .normalize("NFD")
      .replace(/ı/g, "i")
      .replace(/([a-zA-Z])\s*[\u0300-\u036f]+\s*([a-zA-Z])/g, "$1$2")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\r?\n|\r/g, " ")
      .toLocaleLowerCase()
      .trim();
    return cleanText;
  }
}

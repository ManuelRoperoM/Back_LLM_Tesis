import { Injectable } from "@nestjs/common";
import * as path from "path";
import * as fs from "fs";
import * as pdfParse from "pdf-parse";
import rake from "rake-js";
import { EmbeddingService } from "src/embedding/embedding.service";
import { encoding_for_model } from "tiktoken";
import { ConfigService } from "@nestjs/config";
import { Tesis } from "./entites/tesis.entity";
import { ChunkTesis } from "./entites/chunks-tesis.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/entities/user.entity";

@Injectable()
export class UploadTesisService {
  constructor(
    private readonly embeddingService: EmbeddingService,
    private readonly configService: ConfigService,
    @InjectRepository(Tesis)
    private readonly thesisRepository: Repository<Tesis>,
    @InjectRepository(ChunkTesis)
    private readonly chunksRepository: Repository<ChunkTesis>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private UPLOADS_TESIS = this.configService.get<string>("UPLOADS_TESIS");
  private readonly pdfFolderPath = path.join(__dirname, this.UPLOADS_TESIS);

  async saveTesis(
    nameFile: string,
    idUser: number,
    title: string,
  ): Promise<any> {
    const thesisData = await this.generateText(nameFile);
    const user = await this.userRepository.findOneBy({ id: idUser });
    if (!user) {
      throw new Error(`Usuario con id ${idUser} no encontrado`);
    }

    const thesis = await this.thesisRepository.create({
      name: nameFile,
      title: title,
      user,
    });

    await this.thesisRepository.save(thesis);

    // Guardamos los chunks asociados
    const chunks = thesisData.map((chunk) =>
      this.chunksRepository.create({
        chunkNumber: chunk.chunk,
        text: chunk.text,
        embedding: chunk.embedding,
        thesis,
      }),
    );

    await this.chunksRepository.save(chunks);

    return {
      status: 200,
      msge: "trabajo de grado cargado exitosamente",
      idThesis: thesis.id,
    };
  }

  //Metodos upload services

  async generateText(nombreArchivo: string): Promise<any> {
    const CHUNK_SIZE = this.configService.get<string>("CHUNK_MAX_TOKENS");
    const filePath = path.join(this.pdfFolderPath, nombreArchivo);
    if (!fs.existsSync(filePath)) {
      throw new Error("Archivos no encontrado");
    }
    // Extraer texto del pdf:
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);
    const rawText = data.text;
    const text: string = this.cleanText(rawText);
    const chunks = this.chunkText(text, parseInt(CHUNK_SIZE));

    const results = [];
    for (const item of chunks) {
      const data = await this.embeddingService.emmbeddingText(item.texto);
      results.push({
        chunk: item.chunk,
        text: item.texto,
        embedding: data,
      });
    }

    return results;
  }
  private chunkText(text: string, maxTokens: number): any {
    const modelName = "gpt-3.5-turbo";
    const overlap: number = 50;
    const encoder = encoding_for_model(modelName);
    const tokens = encoder.encode(text);
    const chunks = [];
    let chunk = 1;

    let start = 0;

    while (start < tokens.length) {
      const end = Math.min(start + maxTokens, tokens.length);
      const chunkTokens = tokens.slice(start, end);
      const chunkText = new TextDecoder().decode(encoder.decode(chunkTokens));
      chunks.push({
        chunk: chunk.toString(),
        texto: chunkText,
      });

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

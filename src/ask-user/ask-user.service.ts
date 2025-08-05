import { Injectable } from "@nestjs/common";
import { UserAskDto } from "./dto/req_dto/user-ask.dto";
import { ConfigService } from "@nestjs/config";
import { EmbeddingService } from "src/embedding/embedding.service";
import * as fs from "fs";
import * as path from "path";
import { LlmService } from "src/llm/llm.service";

@Injectable()
export class AskUserService {
  constructor(
    private readonly configService: ConfigService,
    private readonly embeddingService: EmbeddingService,
    private readonly llmService: LlmService,
  ) {}
  async responseAskUser(data: UserAskDto): Promise<any> {
    const embeddingAskUser = await this.embeddingService.emmbeddingText(
      data.msge,
    );
    const userEmbedding = embeddingAskUser.embedding;

    //Carga de contenido de la tesis :
    const tesis = await this.loadEmbeddingsFromFile();

    const compare = tesis.map((chunk) => {
      const similarity = this.embeddingService.embeddingCompare(
        userEmbedding,
        chunk.embedding,
      );
      return { ...chunk, similarity };
    });
    const importantChunks = compare
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 3);

    const context = importantChunks.map((c) => c.text).join("\n\n");

    const question = `Pregunta del usuario: ${data.msge}`;
    const prompt = `
      Eres un asesor académico experto en tesis universitarias. Tu objetivo es ayudar al estudiante a entender mejor su trabajo de grado respondiendo a su pregunta con base en los fragmentos relevantes de su tesis.
      
      Responde de manera clara, concisa y formal. Si no hay suficiente información en el contexto para responder con certeza, indícalo explícitamente.
      
      Pregunta del estudiante:
      """
      ${question}
      """
      
      Fragmentos de la tesis relevantes para la pregunta:
      """
      ${context}
      """
      
      Respuesta:
      `;

    const response = await this.llmService.generateAnswer(prompt);

    return { response };
  }

  //Metodos AskUseService

  async loadEmbeddingsFromFile(): Promise<any[]> {
    const filePath = path.join(
      process.cwd(),
      "dataset",
      "embeddings_WilsonCortesSanchez2024.pdf.json",
    );
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(fileContent);
    return data;
  }
}

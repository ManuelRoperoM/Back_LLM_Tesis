import { Injectable } from "@nestjs/common";
import { UserAskDto } from "./dto/req_dto/user-ask.dto";
import { ConfigService } from "@nestjs/config";
import { EmbeddingService } from "src/embedding/embedding.service";
import * as fs from "fs";
import * as path from "path";
import { LlmService } from "src/llm/llm.service";
import { InjectRepository } from "@nestjs/typeorm";
import { ChunkTesis } from "src/upload-tesis/entites/chunks-tesis.entity";
import { Repository } from "typeorm";
import { Tesis } from "src/upload-tesis/entites/tesis.entity";
import { Conversation } from "src/conversation/entities/conversation.entity";

@Injectable()
export class AskUserService {
  constructor(
    private readonly configService: ConfigService,
    private readonly embeddingService: EmbeddingService,
    private readonly llmService: LlmService,
    @InjectRepository(ChunkTesis)
    private readonly chunkTesisRepo: Repository<ChunkTesis>,
    @InjectRepository(Tesis)
    private readonly thesisRepo: Repository<Tesis>,
    @InjectRepository(Conversation)
    private readonly conversationRepo: Repository<Conversation>,
  ) {}

  async responseAskUser(data: UserAskDto): Promise<any> {
    const userEmbedding = await this.embeddingService.emmbeddingText(data.msge);

    // const userEmbedding = embeddingAskUser.embedding;

    // Ultimas 50 conversaciones

    const pastConversations = await this.conversationRepo.find({
      where: { thesis: { id: data.idThesis } },
      select: [
        "id",
        "userEmbedding",
        "botEmbedding",
        "userMessage",
        "botResponse",
        "createdAt",
      ],
      order: { createdAt: "DESC" },
      take: 500,
    });
    // [ compare -1  y 1  ] + created AT
    const rankedByUser = pastConversations.map((conv) => ({
      conv,
      similarity: this.embeddingService.embeddingCompare(
        userEmbedding,
        conv.userEmbedding,
      ),
    }));

    const rankedByBot = pastConversations.map((conv) => ({
      conv,
      similarity: this.embeddingService.embeddingCompare(
        userEmbedding,
        conv.botEmbedding,
      ),
    }));

    // Fusionamos ambos rankings
    const merged = [...rankedByUser, ...rankedByBot];

    // Orden global
    const topConversations = merged
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5); // top K combinados

    // Extraemos solo los objetos Conversation
    const relevantConvs = topConversations.map((item) => item.conv);

    // Quitamos duplicados (por si aparece la misma conversación por user y bot)
    const uniqueRelevantConvs = Array.from(
      new Map(relevantConvs.map((c) => [c.id, c])).values(),
    );

    // Contexto final
    const summarizedConversationContext = uniqueRelevantConvs
      .map(
        (c) =>
          `- Tema tratado: ${c.userMessage.slice(0, 120)}
        Conclusión: ${c.botResponse.slice(0, 180)}`,
      )
      .join("\n");
    //Carga de contenido de la tesis :
    const thesis = await this.thesisRepo.findOne({
      where: { id: data.idThesis },
    });

    const chunks = await this.chunkTesisRepo.find({
      where: { thesis: { id: data.idThesis } },
    });

    //Fragmentos de tesis mas importantes
    const compare = chunks.map((chunk) => {
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
    // To Do Add the context conversation in the prompt
    // const prompt = `
    //   Eres un asesor académico experto en tesis universitarias. Tu objetivo es ayudar al estudiante a entender mejor su trabajo de grado respondiendo a su pregunta con base en los fragmentos relevantes de su tesis.

    //   Responde de manera clara, concisa y formal. Si no hay suficiente información en el contexto para responder con certeza, indícalo explícitamente.

    //   ===== CONTEXTUALIZACION =====

    //   === PREGUNTA DEL ESTUDIANTE: ===
    //   """
    //   ${question}
    //   """
    //   === TITULO DE LA TESIS: ===
    //   """
    //   ${thesis.title}
    //   """
    //   === FREGMENTOS RELEVANTES DE MI TESIS ===
    //   """
    //   ${context}
    //   """

    //   === TEN ENCUENTA EL SIGUIENTE CONTESTO DE  CONVERSACIONES PREVIAS RELEVANTES CONTIGO ===
    //   ${conversationContext}

    //   ===== FIN CONTEXTUALIZACION =====

    //   Responde de forma clara, formal y concisa.
    //   `;

    const prompt = `
    Eres un asesor académico experto en tesis universitarias.
    Tu función es responder preguntas del estudiante utilizando EXCLUSIVAMENTE
    la información contenida en los fragmentos de la tesis proporcionados.
    
    Reglas estrictas de respuesta:
    - Responde en texto plano, sin bloques de código ni markdown
    - No repitas la respuesta
    - No incluyas explicaciones meta (ej: "según el contexto")
    - Sé claro, formal y conciso
    - Si la información no está en la tesis, indícalo explícitamente
    
    ===== CONTEXTO DE LA TESIS =====
    
    Título de la tesis:
    "${thesis.title}"
    
    Fragmentos relevantes:
    "${context}"
    
    ===== MEMORIA CONVERSACIONAL RELEVANTE (uso interno) =====
    Usa esta información solo para mantener coherencia y evitar redundancias.
    No la menciones ni la repitas en la respuesta.
    
    ${summarizedConversationContext}
    
    ===== PREGUNTA DEL ESTUDIANTE =====
    "${question}"
    
    ===== FIN DEL CONTEXTO =====
    
    Redacta una única respuesta clara y académica.
    `;

    console.log("Prompt: ", prompt);

    const response = await this.llmService.generateAnswer(prompt);

    const cleanResponse = this.cleanLLMResponse(response);

    //To Do Save the question and de response in the conversation LLM

    const responseEmbedding =
      await this.embeddingService.emmbeddingText(cleanResponse);

    await this.conversationRepo.save({
      userMessage: data.msge,
      botResponse: cleanResponse,
      userEmbedding: userEmbedding,
      botEmbedding: responseEmbedding,
      thesis: thesis,
    });

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

  cleanLLMResponse(text: string) {
    return text
      .replace(/```[\s\S]*?```/g, "") // elimina bloques de código
      .replace(/`+/g, "") // elimina backticks sueltos
      .replace(/\n{3,}/g, "\n\n") // normaliza saltos
      .trim();
  }
}

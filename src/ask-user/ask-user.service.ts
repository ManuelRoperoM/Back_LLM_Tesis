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

    // const prompt = `
    // Eres un asesor académico experto en sistemas de potencia y medición eléctrica.
    // Respondes preguntas sobre una tesis universitaria usando únicamente el contexto proporcionado.

    // Reglas estrictas:
    // - Responde en texto plano
    // - No repitas ideas
    // - No generalices si el contexto es específico
    // - Evita definiciones genéricas
    // - Sé claro, técnico y preciso

    // Estructura obligatoria de la respuesta:
    // 1. Respuesta directa a la pregunta
    // 2. Explicación técnica breve
    // 3. Relación con el trabajo de grado

    // ===== CONTEXTO DE LA TESIS =====
    // Título: "${thesis.title}"

    // Fragmentos relevantes:
    // "${context}"

    // ===== MEMORIA CONVERSACIONAL (uso interno) =====
    // ${summarizedConversationContext}

    // ===== PREGUNTA DEL ESTUDIANTE =====
    // "${question}"

    // Redacta una única respuesta coherente y académica.
    // `;

    const prompt = `
    Eres un asesor académico experto en sistemas de potencia y medición eléctrica.
    Respondes preguntas sobre una tesis universitaria usando únicamente el contexto proporcionado.
    
    INSTRUCCIONES ESTRICTAS (OBLIGATORIAS):
    - Responde UNA SOLA VEZ
    - NO repitas contenido ni reformules ideas
    - NO enumeres ni repitas la estructura
    - NO incluyas introducciones ni conclusiones
    - Responde en texto plano y tono académico
    - Si la información no está en el contexto, indícalo claramente
    
    FORMATO DE RESPUESTA (NO REPETIR TÍTULOS):
    Respuesta directa:
    <texto>
    
    Explicación técnica breve:
    <texto>
    
    Relación con el trabajo de grado:
    <texto>
    
    ===== CONTEXTO DE LA TESIS =====
    Título: "${thesis.title}"
    
    Fragmentos relevantes:
    ${context}
    
    ===== MEMORIA CONVERSACIONAL (SOLO REFERENCIA, NO REPETIR) =====
    ${summarizedConversationContext}
    
    ===== PREGUNTA DEL ESTUDIANTE =====
    ${question}
    
    FINALIZA LA RESPUESTA AL TERMINAR LA ÚLTIMA SECCIÓN.
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

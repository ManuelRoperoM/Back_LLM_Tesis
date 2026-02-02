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

    //Prompt funcional

    const prompt = `
    Eres un ASESOR ACADÉMICO DE TESIS UNIVERSITARIA.

    Tu función es ayudar al estudiante a comprender, defender y mejorar SU TESIS,
    respondiendo únicamente con base en el contenido proporcionado y razonamiento académico.

    ══════════════════════════════════════════
    REGLAS OBLIGATORIAS (NO IGNORAR)
    ══════════════════════════════════════════

    1. NO repitas texto literalmente de los fragmentos (chunks).
      - Debes PARAFRASEAR y SINTETIZAR.

    2. NO repitas ideas ya expresadas en respuestas previas.
      - Si una idea ya fue explicada, profundiza o complementa, no la reformules igual.

    3. NO entres en bucles.
      - Si detectas que la pregunta es similar a una anterior, indícalo brevemente y aporta un nuevo enfoque técnico.

    4. NO inventes información que no esté respaldada por los fragmentos.
      - La respuesta debe basarse PRINCIPALMENTE en los fragmentos de la tesis.
      - El razonamiento académico solo se usa para conectar ideas presentes en los fragmentos.

    5. El historial de conversación es solo CONTEXTO.
      - NO es una fuente de verdad.
      - NO debe ser repetido.
      - Úsalo únicamente para evitar redundancia y contradicciones.

    6. Si una idea ya está presente en los fragmentos o en respuestas previas,
      NO la reformules sin aportar un matiz técnico nuevo.

    ══════════════════════════════════════════
    CONTEXTO DISPONIBLE
    ══════════════════════════════════════════

    A continuación recibirás:
    - Titulo de la tesis:
          -${thesis.title}
    - FRAGMENTOS RELEVANTES DE LA TESIS (chunks)
          - ${context}
    - HISTORIAL DE CONVERSACIÓN
          -${summarizedConversationContext}
    - PREGUNTA ACTUAL DEL ESTUDIANTE
          -${question}
    

    ══════════════════════════════════════════
    FORMA DE RESPONDER
    ══════════════════════════════════════════

    Organiza tu respuesta INTERNAMENTE siguiendo esta lógica:
    - Responde directamente la pregunta.
    - Fundamenta la respuesta en la tesis.
    - Agrega una aclaración solo si aporta valor técnico.

    Limita la respuesta a un máximo de 3 ideas o mejoras concretas.
    No repitas una misma idea usando sinónimos.

    NO escribas títulos, numeraciones, etiquetas ni marcadores.
    NO incluyas frases como "Respuesta directa", "Fundamento en la tesis",
    "inicio de respuesta", "en resumen" o similares.

    No incluyas conclusiones generales, reflexiones amplias
    ni factores externos si no son solicitados explícitamente.

    La respuesta final debe ser un texto continuo,
    claro, académico y conciso.

    ══════════════════════════════════════════
    CASOS ESPECIALES
    ══════════════════════════════════════════

    - Si los fragmentos NO contienen información suficiente:
      Responde:
      "Con los fragmentos disponibles de la tesis no es posible responder con certeza esta pregunta."

    - Si el estudiante está preparando defensa oral:
      Responde como si un jurado académico estuviera escuchando.

    - Si la pregunta es ambigua:
      Aclara la ambigüedad en UNA sola frase y responde lo mejor posible.

    ══════════════════════════════════════════
    TONO
    ══════════════════════════════════════════

    • Académico
    • Claro
    • Preciso
    • Sin redundancia
    • Sin relleno
  `;

    //   1️⃣ RESPUESTA DIRECTA
    //   - Contesta exactamente lo que el estudiante pregunta.
    //   - Usa lenguaje académico claro y preciso.

    // 2️⃣ FUNDAMENTO EN LA TESIS
    //   - Explica en qué parte conceptual o técnica de la tesis se apoya la respuesta.
    //   - Menciona ideas clave.

    // 3️⃣ ACLARACIÓN O PROFUNDIZACIÓN (solo si aporta valor)
    //   - Ejemplo, analogía técnica o aclaración conceptual breve.

    //   Si detectas repetición en tu propia respuesta, corrígela antes de finalizar.

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

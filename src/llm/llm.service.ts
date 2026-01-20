import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

@Injectable()
export class LlmService {
  // constructor(
  //   private readonly httpService: HttpService,
  //   private readonly configService: ConfigService,
  //   @Inject(LLM_ADAPTER)
  //   private readonly llm: LLMAdapter,
  // ) {}

  private readonly bedrockClient: BedrockRuntimeClient;

  constructor(private readonly configService: ConfigService) {
    this.bedrockClient = new BedrockRuntimeClient({
      region: this.configService.get<string>("AWS_REGION") || "us-east-2",
    });
  }

  /**
   * Genera respuesta usando el modelo de Amazon Bedrock directamente
   * @param prompt Texto de entrada para el modelo
   * @param temperature Opcional, default 0.2
   * @param maxTokens Opcional, default 600
   * @returns Respuesta generada por el LLM
   */
  async generateAnswer(
    prompt: string,
    temperature = 0.2,
    maxTokens = 600,
  ): Promise<string> {
    try {
      const command = new InvokeModelCommand({
        modelId: "meta.llama3-3-70b-instruct-v1:0", // Ajusta aquí al modelo que quieras usar
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify({
          prompt,
          temperature: temperature,
          max_gen_len: maxTokens,
        }),
      });

      const response = await this.bedrockClient.send(command);

      // Parseamos la respuesta
      const result = JSON.parse(Buffer.from(response.body).toString("utf-8"));

      // Titan devuelve el texto generado en result.outputText
      return result.outputText || "No se pudo generar respuesta";
    } catch (error) {
      console.error("❌ Error generando respuesta con Bedrock:", error);
      throw new InternalServerErrorException(
        "Error generando respuesta con el modelo LLM",
      );
    }
  }
}

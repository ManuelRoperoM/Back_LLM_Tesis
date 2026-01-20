import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { BedrockRuntimeClient } from "@aws-sdk/client-bedrock-runtime";

@Injectable()
export class EmbeddingService {
  private readonly bedrockClient: BedrockRuntimeClient;
  constructor() {
    this.bedrockClient = new BedrockRuntimeClient({
      region: process.env.AWS_REGION || "us-east-2",
    });
  }

  async emmbeddingText(text: string) {
    try {
      const command = new InvokeModelCommand({
        modelId: "amazon.titan-embed-text-v2:0",
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify({
          inputText: text,
        }),
      });

      const response = await this.bedrockClient.send(command);

      const result = JSON.parse(Buffer.from(response.body).toString("utf-8"));

      return result.embedding; // vector de 1024 dimensiones
    } catch (error) {
      console.error("❌ Error generando embedding (Titan):", error);
      throw new InternalServerErrorException(
        "No se pudo generar el embedding con Amazon Titan",
      );
    }
  }

  embeddingCompare(vecA: number[], vecB: number[]) {
    //Coseno compare : (A . B) / |A| * |B| -> A y B son vectores en R n
    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const normA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const normB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    return dotProduct / (normA * normB);
  }
}

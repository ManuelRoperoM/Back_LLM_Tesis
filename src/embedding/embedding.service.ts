import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class EmbeddingService {
  constructor(private readonly configService: ConfigService) {}
  private API_URL = this.configService.get<string>("EMBEDDING_API_URL");

  async emmbeddingText(text: string) {
    const response = await fetch(this.API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "nomic-embed-text",
        prompt: text,
      }),
    });
    const data = await response.json();
    console.log("Text: ", text);
    return data;
  }

  embeddingCompare(vecA: number[], vecB: number[]) {
    //Coseno compare : (A . B) / |A| * |B| -> A y B son vectores en R n
    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const normA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const normB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    return dotProduct / (normA * normB);
  }
}

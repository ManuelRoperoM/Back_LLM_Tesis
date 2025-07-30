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

    const data = response.json();
    return data;
  }
}

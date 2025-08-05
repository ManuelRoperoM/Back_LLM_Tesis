import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import * as readline from "readline";

@Injectable()
export class LlmService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}
  async generateAnswer(prompt: string): Promise<string> {
    const url = this.configService.get<string>("URL_LLM");

    const response = await this.httpService.axiosRef.post(
      url,
      {
        model: "llama3.2:3b",
        prompt: prompt,
        stream: true,
      },
      {
        responseType: "stream",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const rl = readline.createInterface({
      input: response.data,
      crlfDelay: Infinity,
    });
    let fullText = "";

    for await (const line of rl) {
      if (line.trim() === "") continue;
      try {
        const parsed = JSON.parse(line);
        fullText += parsed.response;
        if (parsed.done) break;
      } catch (e) {
        console.warn("Línea inválida:", e);
      }
    }

    return fullText.trim();
  }
}

import { Inject, Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { LLMAdapter } from "./llm.adapter";
import { LLM_ADAPTER } from "./llm.constants";

@Injectable()
export class LlmService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject(LLM_ADAPTER)
    private readonly llm: LLMAdapter,
  ) {}
  async generateAnswer(prompt: string): Promise<string> {
    return this.llm.generate(prompt);
  }
}

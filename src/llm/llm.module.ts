import { Module } from "@nestjs/common";
import { LLM_ADAPTER } from "./llm.constants";
import { BedrockAdapter } from "./adapters/bedrock.adapter";
import { HttpLLMAdapter } from "./adapters/http.adapter";
import { HttpModule } from "@nestjs/axios";
import { LlmService } from "./llm.service";

@Module({
  imports: [HttpModule],
  providers: [
    LlmService,
    {
      provide: LLM_ADAPTER,
      useClass:
        process.env.LLM_PROVIDER === "bedrock"
          ? BedrockAdapter
          : HttpLLMAdapter,
    },
  ],
  exports: [LLM_ADAPTER, LlmService],
})
export class LLMModule {}

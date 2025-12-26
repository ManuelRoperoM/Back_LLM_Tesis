import { Injectable } from "@nestjs/common";
import axios from "axios";
import { LLMAdapter } from "../llm.adapter";

@Injectable()
export class HttpLLMAdapter implements LLMAdapter {
  async generate(prompt: string): Promise<string> {
    const { data } = await axios.post(
      process.env.URL_LLM,
      {
        model: "qwen2.5:14b",
        prompt,
        stream: false,
      },
      { headers: { "Content-Type": "application/json" } },
    );
    return data?.response ?? "No se pudo generar respuesta";
  }
}

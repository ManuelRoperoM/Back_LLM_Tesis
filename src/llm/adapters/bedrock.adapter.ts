import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { LLMAdapter } from "../llm.adapter";

@Injectable()
export class BedrockAdapter implements LLMAdapter {
  constructor(
    @Inject("BEDROCK_CLIENT")
    private readonly client: BedrockRuntimeClient,
  ) {}
  async generate(prompt: string): Promise<string> {
    try {
      // const command = new InvokeModelCommand({
      //   modelId: "amazon.titan-text-express-v1",
      //   contentType: "application/json",
      //   accept: "application/json",
      //   body: JSON.stringify({
      //     messages: [{ role: "user", content: prompt }],
      //     max_tokens: 500,
      //     temperature: 0.2,
      //   }),
      // });

      const command = new InvokeModelCommand({
        modelId: "amazon.titan-text-express-v1",
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify({
          inputText: prompt,
          textGenerationConfig: {
            maxTokenCount: 500,
            temperature: 0.2,
          },
        }),
      });

      // const response = await this.client.send(command);
      // const result = JSON.parse(Buffer.from(response.body).toString());

      // return (
      //   result.choices?.[0]?.message?.content ?? "No se pudo generar respuesta"
      // );

      const response = await this.client.send(command);
      const result = JSON.parse(Buffer.from(response.body).toString("utf-8"));

      return result.results?.[0]?.outputText ?? "No se pudo generar respuesta";
    } catch (error) {
      throw new InternalServerErrorException(
        `Error generando respuesta con Bedrock: ${error}`,
      );
    }
  }
}

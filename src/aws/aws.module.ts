import { Module } from "@nestjs/common";
import { BedrockRuntimeClient } from "@aws-sdk/client-bedrock-runtime";

@Module({
  providers: [
    {
      provide: "BEDROCK_CLIENT",
      useFactory: () =>
        new BedrockRuntimeClient({
          region: process.env.AWS_REGION || "us-east-2",
        }),
    },
  ],
  exports: ["BEDROCK_CLIENT"],
})
export class AwsModule {}

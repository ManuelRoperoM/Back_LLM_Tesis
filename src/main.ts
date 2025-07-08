import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  console.log("✅ Antes de listen");
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
  const url = await app.getUrl();
  console.log(`🚀 App is running at: ${url}`);
}
bootstrap();

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  console.log("✅ Antes de listen");
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.APP_PORT ?? 3000);
  const url = await app.getUrl();
  // DEBUG=* npm run start:dev
  console.log(`🚀 App is running at: ${url}`);
}
bootstrap();

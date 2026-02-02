import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  console.log("✅ Antes de listen");

  const config = new DocumentBuilder()
    .setTitle("API Tesis LLM")
    .setDescription("API para chat y consultas sobre trabajos de grado")
    .setVersion("1.0")
    .build();

  const app = await NestFactory.create(AppModule);

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  app.enableCors({
    origin: process.env.ORIGIN_FRONT,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  });

  await app.listen(process.env.APP_PORT ?? 3000);
  const url = await app.getUrl();
  // DEBUG=* npm run start:dev
  console.log(`🚀 App is running at: ${url}`);
}
bootstrap();

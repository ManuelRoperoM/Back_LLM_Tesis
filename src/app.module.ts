import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UploadTesisModule } from "./upload-tesis/upload-tesis.module";
import { EmbeddingService } from "./embedding/embedding.service";
import { EmbeddingModule } from "./embedding/embedding.module";
import { ConfigModule } from "@nestjs/config";
import { AskUserModule } from "./ask-user/ask-user.module";
import { LlmModule } from "./llm/llm.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "./user/user.module";
import { Tesis } from "./upload-tesis/entites/tesis.entity";
import { User } from "./user/entities/user.entity";
import { ChunkTesis } from "./upload-tesis/entites/chunks-tesis.entity";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.HOST,
      port: parseInt(process.env.PORT),
      username: process.env.USER_DB,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      synchronize: false,
      logging: true,
      entities: [Tesis, User, ChunkTesis],
    }),
    UploadTesisModule,
    EmbeddingModule,
    AskUserModule,
    LlmModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, EmbeddingService],
})
export class AppModule {}

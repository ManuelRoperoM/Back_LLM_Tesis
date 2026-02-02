import { Module } from "@nestjs/common";
import { ConversationController } from "./conversation.controller";
import { ConversationService } from "./conversation.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Conversation } from "./entities/conversation.entity";
import { Tesis } from "src/upload-tesis/entites/tesis.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Tesis, Conversation])],
  controllers: [ConversationController],
  providers: [ConversationService],
})
export class ConversationModule {}

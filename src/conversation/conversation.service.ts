import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Conversation } from "./entities/conversation.entity";
import { Repository } from "typeorm";
import { Tesis } from "src/upload-tesis/entites/tesis.entity";

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @InjectRepository(Tesis)
    private readonly thesisRepository: Repository<Tesis>,
  ) {}
  async getConversationThesis(id: number, limit: number) {
    const thesis = await this.thesisRepository.findOne({ where: { id: id } });
    if (!thesis) {
      throw new NotFoundException("No existe una tesis");
    }
    const context = this.conversationRepository.find({
      where: { thesis: thesis },
      select: {
        id: true,
        userMessage: true,
        botResponse: true,
        createdAt: true, // opcional, útil para ordenar
      },
      order: { createdAt: "DESC" },
      take: limit,
    });

    return (await context).reverse();
  }
}

import { Controller, Get, Param, ParseIntPipe, Query } from "@nestjs/common";
import { ConversationService } from "./conversation.service";

@Controller("conversation")
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}
  @Get(":id")
  conversationThesis(
    @Param("id", ParseIntPipe) id: number,
    @Query("limit", ParseIntPipe) limit = 100,
  ) {
    return this.conversationService.getConversationThesis(id, limit);
  }
}

import { Controller, Get, Param, ParseIntPipe, Query } from "@nestjs/common";
import { ConversationService } from "./conversation.service";
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";

@ApiTags("Conversations")
@Controller("conversation")
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}
  @Get(":id")
  @ApiOperation({
    summary: "Obtener historial de conversación por tesis",
    description:
      "Retorna las últimas conversaciones entre el usuario y el bot para una tesis",
  })
  @ApiParam({
    name: "id",
    type: Number,
    example: 9,
    description: "ID del trabajo de grado",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    example: 50,
    description: "Cantidad máxima de conversaciones a retornar (default 100)",
  })
  @ApiOkResponse({
    description: "Historial de conversaciones",
    example: [
      {
        userMessage: "¿Qué es la potencia reactiva?",
        botResponse: "La potencia reactiva es...",
        createdAt: "2026-02-02T10:30:00.000Z",
      },
    ],
  })
  conversationThesis(
    @Param("id", ParseIntPipe) id: number,
    @Query("limit", ParseIntPipe) limit = 100,
  ) {
    return this.conversationService.getConversationThesis(id, limit);
  }
}

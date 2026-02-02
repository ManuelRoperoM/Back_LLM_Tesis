import { Body, Controller, Post } from "@nestjs/common";
import { AskUserService } from "./ask-user.service";
import { UserAskDto } from "./dto/req_dto/user-ask.dto";
import { ApiTags, ApiOperation, ApiBody, ApiOkResponse } from "@nestjs/swagger";

@ApiTags("Chat")
@Controller("ask-user")
export class AskUserController {
  constructor(private readonly askUserService: AskUserService) {}

  @Post()
  @ApiOperation({
    summary: "Realizar una pregunta a la tesis",
    description:
      "Envía una pregunta al LLM y retorna una respuesta basada en el contenido del trabajo de grado",
  })
  @ApiBody({ type: UserAskDto })
  @ApiOkResponse({
    description: "Respuesta generada por el bot",
    example: {
      response: "La potencia reactiva se calcula como...",
    },
  })
  userQuestion(@Body() askUser: UserAskDto) {
    return this.askUserService.responseAskUser(askUser);
  }
}

import { Body, Controller, Post } from "@nestjs/common";
import { AskUserService } from "./ask-user.service";
import { UserAskDto } from "./dto/req_dto/user-ask.dto";

@Controller("ask-user")
export class AskUserController {
  constructor(private readonly askUserService: AskUserService) {}

  @Post()
  userQuestion(@Body() askUser: UserAskDto) {
    return this.askUserService.responseAskUser(askUser);
  }
}

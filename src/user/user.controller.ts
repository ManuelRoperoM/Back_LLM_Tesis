import { Body, Controller, Post } from "@nestjs/common";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("login-auto")
  async loginAuto(
    @Body() datosUsuario: { email: string; nombre: string; code: string },
  ) {
    return this.userService.logister(datosUsuario);
  }
}

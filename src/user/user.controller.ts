import { Body, Controller, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("Usuarios")
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("login-auto")
  @ApiOperation({
    summary: "Login automático de usuario",
    description:
      "Registra o autentica un usuario utilizando un proveedor externo (Google, OAuth, etc.)",
  })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        email: {
          type: "string",
          example: "manuel@gmail.com",
        },
        nombre: {
          type: "string",
          example: "Manuel Ropero",
        },
        code: {
          type: "string",
          example: "GOOGLE-123456",
        },
      },
      required: ["email", "nombre", "code"],
    },
  })
  @ApiOkResponse({
    description: "Usuario autenticado correctamente",
    example: {
      id: 5,
      email: "manuel@gmail.com",
      nombre: "Manuel Ropero",
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    },
  })
  async loginAuto(
    @Body() datosUsuario: { email: string; nombre: string; code: string },
  ) {
    return this.userService.logister(datosUsuario);
  }
}

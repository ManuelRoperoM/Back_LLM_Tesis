import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UserAskDto {
  @ApiProperty({
    example: "¿Cómo se calcula la potencia reactiva?",
    description: "Pregunta que realiza el usuario al chat",
  })
  @IsString()
  @IsNotEmpty()
  msge: string;

  @ApiProperty({
    example: 9,
    description: "ID del trabajo de grado",
  })
  @IsNumber()
  @IsNotEmpty()
  idThesis: number;
}

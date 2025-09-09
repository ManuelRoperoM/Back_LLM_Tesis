import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UserAskDto {
  @IsString()
  @IsNotEmpty()
  msge: string;

  @IsNumber()
  @IsNotEmpty()
  idTesis: string;
}

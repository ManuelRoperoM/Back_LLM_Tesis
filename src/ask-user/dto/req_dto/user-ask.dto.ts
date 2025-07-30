import { IsNotEmpty, IsString } from "class-validator";

export class UserAskDto {
  @IsString()
  @IsNotEmpty()
  msge: string;
}

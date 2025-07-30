import { Injectable } from "@nestjs/common";
import { UserAskDto } from "./dto/req_dto/user-ask.dto";
import { ConfigService } from "@nestjs/config";
import { EmbeddingService } from "src/embedding/embedding.service";

@Injectable()
export class AskUserService {
  constructor(
    private readonly configService: ConfigService,
    private readonly embeddingService: EmbeddingService,
  ) {}
  async responseAskUser(data: UserAskDto): Promise<any> {
    const embeddingAskUser = await this.embeddingService.emmbeddingText(
      data.msge,
    );
    return embeddingAskUser.embedding;
  }

  //Metodos AskUserService
}

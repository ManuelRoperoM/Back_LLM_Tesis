import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { Tesis } from "src/upload-tesis/entites/tesis.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Tesis)
    private readonly tesisRepository: Repository<Tesis>,
  ) {}

  //Find or create User
  async logister(datosUsuario: {
    email: string;
    nombre: string;
    code: string;
  }) {
    try {
      let user = await this.userRepository.findOne({
        where: { email: datosUsuario.email },
      });

      if (!user) {
        user = this.userRepository.create({
          email: datosUsuario.email,
          name: datosUsuario.nombre,
          codeStudent: datosUsuario.code
            ? datosUsuario.code
            : datosUsuario.email,
        });
        await this.userRepository.save(user);
      }
      const idThesis = await this.getTesisByUserId(user.id);

      return { status: 200, data: { ...user, thesisId: idThesis } };
    } catch (error) {
      return { status: 500, msg: error.message };
    }
  }

  private async getTesisByUserId(userId: number) {
    const tesis = await this.tesisRepository.findOne({
      where: { user: { id: userId } },
      relations: ["user"],
      order: { id: "DESC" },
    });

    return tesis ? tesis.id : 0;
  }
}

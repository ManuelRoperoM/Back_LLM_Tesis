import { Tesis } from "src/upload-tesis/entites/tesis.entity";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";

@Entity("user")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: "code-student", unique: true })
  codeStudent: string;

  @OneToMany(() => Tesis, (thesis) => thesis.user)
  theses: Tesis[];
}

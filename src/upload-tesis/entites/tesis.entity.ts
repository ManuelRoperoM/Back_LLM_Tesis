import { User } from "src/user/entities/user.entity";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { ChunkTesis } from "./chunks-tesis.entity";
import { Conversation } from "src/conversation/entities/conversation.entity";

@Entity("tesis")
export class Tesis {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  title: string;

  @ManyToOne(() => User, (user) => user.theses, { onDelete: "CASCADE" })
  @JoinColumn({ name: "id-student" })
  user: User;

  @OneToMany(() => ChunkTesis, (chunk) => chunk.thesis)
  chunk: ChunkTesis[];

  @OneToMany(() => Conversation, (conversation) => conversation.thesis)
  conversation: Conversation[];
}

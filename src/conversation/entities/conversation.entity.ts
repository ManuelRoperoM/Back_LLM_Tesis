import { Tesis } from "src/upload-tesis/entites/tesis.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("conversation")
export class Conversation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "user-message", type: "longtext" })
  userMessage: string;

  @Column({ name: "bot-response", type: "longtext" })
  botResponse: string;

  @Column({ name: "user-embedding", type: "json" })
  userEmbedding: number[];

  @Column({ name: "bot-embedding", type: "json" })
  botEmbedding: number[];

  @CreateDateColumn({
    name: "created_at",
    type: "datetime",
  })
  createdAt: Date;

  @ManyToOne(() => Tesis, (thesis) => thesis.conversation, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "id-tesis" })
  thesis: Tesis;
}

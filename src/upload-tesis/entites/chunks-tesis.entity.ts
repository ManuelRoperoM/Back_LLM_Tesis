import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Tesis } from "./tesis.entity";

@Entity("chunks-tesis")
export class ChunkTesis {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "chunk-number" })
  chunkNumber: number;

  @Column("longtext")
  text: string;

  @Column("json")
  embedding: number[];

  @ManyToOne(() => Tesis, (thesis) => thesis.chunk, { onDelete: "CASCADE" })
  @JoinColumn({ name: "id-tesis" })
  thesis: Tesis;
}

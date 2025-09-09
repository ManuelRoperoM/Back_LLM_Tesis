import { MigrationInterface, QueryRunner } from "typeorm";

export class JsonTypeEmbeddingChunkTable1756751170050 implements MigrationInterface {
    name = 'JsonTypeEmbeddingChunkTable1756751170050'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`chunks-tesis\` DROP COLUMN \`embedding\``);
        await queryRunner.query(`ALTER TABLE \`chunks-tesis\` ADD \`embedding\` json NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`chunks-tesis\` DROP COLUMN \`embedding\``);
        await queryRunner.query(`ALTER TABLE \`chunks-tesis\` ADD \`embedding\` text NOT NULL`);
    }

}

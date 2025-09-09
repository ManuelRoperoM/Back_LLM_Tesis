import { MigrationInterface, QueryRunner } from "typeorm";

export class LongTextChunkTable1756750633414 implements MigrationInterface {
    name = 'LongTextChunkTable1756750633414'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`chunks-tesis\` DROP COLUMN \`text\``);
        await queryRunner.query(`ALTER TABLE \`chunks-tesis\` ADD \`text\` longtext NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`chunks-tesis\` DROP COLUMN \`text\``);
        await queryRunner.query(`ALTER TABLE \`chunks-tesis\` ADD \`text\` varchar(255) NOT NULL`);
    }

}

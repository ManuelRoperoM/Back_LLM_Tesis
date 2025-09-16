import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPhone1757516678095 implements MigrationInterface {
    name = 'AddPhone1757516678095'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`phone\` int NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`phone\``);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class DeleteIdentificationUser1758645386738 implements MigrationInterface {
    name = 'DeleteIdentificationUser1758645386738'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_f412710a11f9150c714929c9d0\` ON \`user\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`identification\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`phone\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`phone\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`identification\` varchar(255) NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_f412710a11f9150c714929c9d0\` ON \`user\` (\`identification\`)`);
    }

}

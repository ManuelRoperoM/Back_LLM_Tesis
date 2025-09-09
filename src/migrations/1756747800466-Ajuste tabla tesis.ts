import { MigrationInterface, QueryRunner } from "typeorm";

export class AjusteTablaTesis1756747800466 implements MigrationInterface {
    name = 'AjusteTablaTesis1756747800466'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_178b44cad66d4166f20c95d5fd\` ON \`user\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`code-student\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`code-student\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD UNIQUE INDEX \`IDX_178b44cad66d4166f20c95d5fd\` (\`code-student\`)`);
        await queryRunner.query(`DROP INDEX \`IDX_f412710a11f9150c714929c9d0\` ON \`user\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`identification\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`identification\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD UNIQUE INDEX \`IDX_f412710a11f9150c714929c9d0\` (\`identification\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP INDEX \`IDX_f412710a11f9150c714929c9d0\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`identification\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`identification\` int NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_f412710a11f9150c714929c9d0\` ON \`user\` (\`identification\`)`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP INDEX \`IDX_178b44cad66d4166f20c95d5fd\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`code-student\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`code-student\` int NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_178b44cad66d4166f20c95d5fd\` ON \`user\` (\`code-student\`)`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1756143867939 implements MigrationInterface {
  name = "InitMigration1756143867939";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`code-student\` int NOT NULL, \`identification\` int NOT NULL, UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), UNIQUE INDEX \`IDX_178b44cad66d4166f20c95d5fd\` (\`code-student\`), UNIQUE INDEX \`IDX_f412710a11f9150c714929c9d0\` (\`identification\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`chunks-tesis\` (\`id\` int NOT NULL AUTO_INCREMENT, \`chunk-number\` int NOT NULL, \`text\` varchar(255) NOT NULL, \`embedding\` text NOT NULL, \`id-tesis\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`tesis\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`title\` varchar(255) NOT NULL, \`id-student\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`chunks-tesis\` ADD CONSTRAINT \`FK_ace989dda066a409b4367b9cdf2\` FOREIGN KEY (\`id-tesis\`) REFERENCES \`tesis\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`tesis\` ADD CONSTRAINT \`FK_d2934dbdae90e917b37b2261527\` FOREIGN KEY (\`id-student\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`tesis\` DROP FOREIGN KEY \`FK_d2934dbdae90e917b37b2261527\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`chunks-tesis\` DROP FOREIGN KEY \`FK_ace989dda066a409b4367b9cdf2\``,
    );
    await queryRunner.query(`DROP TABLE \`tesis\``);
    await queryRunner.query(`DROP TABLE \`chunks-tesis\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_f412710a11f9150c714929c9d0\` ON \`user\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_178b44cad66d4166f20c95d5fd\` ON \`user\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``,
    );
    await queryRunner.query(`DROP TABLE \`user\``);
  }
}

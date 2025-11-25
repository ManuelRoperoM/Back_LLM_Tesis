import { MigrationInterface, QueryRunner } from "typeorm";

export class ContextConversation1762959892981 implements MigrationInterface {
  name = "ContextConversation1762959892981";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`Conversation\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user-message\` longtext NOT NULL, \`bot-response\` longtext NOT NULL, \`user-embedding\` json NOT NULL, \`bot-embedding\` json NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`id-tesis\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Conversation\` ADD CONSTRAINT \`FK_b98f5ed120cc0c768c3b40d9434\` FOREIGN KEY (\`id-tesis\`) REFERENCES \`tesis\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`Conversation\` DROP FOREIGN KEY \`FK_b98f5ed120cc0c768c3b40d9434\``,
    );
    await queryRunner.query(`DROP TABLE \`Conversation\``);
  }
}

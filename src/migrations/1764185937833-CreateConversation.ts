import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateConversation1764185937833 implements MigrationInterface {
    name = 'CreateConversation1764185937833'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`conversation\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user-message\` longtext NOT NULL, \`bot-response\` longtext NOT NULL, \`user-embedding\` json NOT NULL, \`bot-embedding\` json NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`id-tesis\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`conversation\` ADD CONSTRAINT \`FK_32e2e2ab381e8bdb2789fa04d2a\` FOREIGN KEY (\`id-tesis\`) REFERENCES \`tesis\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`conversation\` DROP FOREIGN KEY \`FK_32e2e2ab381e8bdb2789fa04d2a\``);
        await queryRunner.query(`DROP TABLE \`conversation\``);
    }

}

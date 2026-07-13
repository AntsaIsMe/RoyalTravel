<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260630182654 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE place ADD CONSTRAINT FK_741D53CD1C03382A FOREIGN KEY (idvoit) REFERENCES voiture (idvoit)');
        $this->addSql('ALTER TABLE reserver ADD destination VARCHAR(100) NOT NULL');
        $this->addSql('ALTER TABLE reserver ADD CONSTRAINT FK_B9765E931C03382A FOREIGN KEY (idvoit) REFERENCES voiture (idvoit)');
        $this->addSql('ALTER TABLE reserver ADD CONSTRAINT FK_B9765E9351F30A5B FOREIGN KEY (idcli) REFERENCES client (idcli)');
        $this->addSql('ALTER TABLE reserver ADD CONSTRAINT FK_B9765E93741D53CD FOREIGN KEY (place) REFERENCES place (place)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE place DROP FOREIGN KEY FK_741D53CD1C03382A');
        $this->addSql('ALTER TABLE reserver DROP FOREIGN KEY FK_B9765E931C03382A');
        $this->addSql('ALTER TABLE reserver DROP FOREIGN KEY FK_B9765E9351F30A5B');
        $this->addSql('ALTER TABLE reserver DROP FOREIGN KEY FK_B9765E93741D53CD');
        $this->addSql('ALTER TABLE reserver DROP destination');
    }
}

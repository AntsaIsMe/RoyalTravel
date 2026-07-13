<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260628124152 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE place (place INT NOT NULL, occupation VARCHAR(3) NOT NULL, idvoit VARCHAR(100) NOT NULL, INDEX IDX_741D53CD1C03382A (idvoit), PRIMARY KEY (idvoit, place)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE reserver (idreserv VARCHAR(100) NOT NULL, datereserv DATETIME NOT NULL, datevoyage DATE NOT NULL, payement VARCHAR(100) DEFAULT NULL, montant_avance INT DEFAULT NULL, idvoit VARCHAR(100) NOT NULL, idcli INT NOT NULL, place INT NOT NULL, INDEX IDX_B9765E931C03382A (idvoit), INDEX IDX_B9765E9351F30A5B (idcli), INDEX IDX_B9765E93741D53CD (place), PRIMARY KEY (idreserv, idvoit, idcli, place, datereserv)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE voiture (idvoit VARCHAR(100) NOT NULL, design VARCHAR(100) NOT NULL, type VARCHAR(9) NOT NULL, nbrplace INT NOT NULL, frais INT NOT NULL, PRIMARY KEY (idvoit)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('ALTER TABLE place ADD CONSTRAINT FK_741D53CD1C03382A FOREIGN KEY (idvoit) REFERENCES voiture (idvoit)');
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
        $this->addSql('DROP TABLE place');
        $this->addSql('DROP TABLE reserver');
        $this->addSql('DROP TABLE voiture');
    }
}

<?php

namespace App\Entity;

use App\Repository\RESERVERRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: RESERVERRepository::class)]
class RESERVER
{
    #[ORM\Id]
    #[ORM\Column(length: 100)]
    private ?string $idreserv = null;

    #[ORM\Id]
    #[ORM\ManyToOne]
    #[ORM\JoinColumn(name: "idvoit", referencedColumnName: "idvoit", nullable: false)]
    private ?VOITURE $idvoit = null;

    #[ORM\Id]
    #[ORM\ManyToOne]
    #[ORM\JoinColumn(name: "idcli", referencedColumnName: "idcli", nullable: false)]
    private ?CLIENT $idcli = null;

    #[ORM\Id]
    #[ORM\ManyToOne]
    #[ORM\JoinColumn(name: "place", referencedColumnName: "place",nullable: false)]
    private ?PLACE $place = null;

    #[ORM\Id]
    #[ORM\Column]
    private ?\DateTime $datereserv = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTime $datevoyage = null;

    #[ORM\Column(length: 100, nullable: true)]
    private ?string $payement = null;

    #[ORM\Column(nullable: true)]
    private ?int $montant_avance = null;

    #[ORM\Column(length: 100)]
    private ?string $destination = null;

    public function getIdreserv(): ?string
    {
        return $this->idreserv;
    }

    public function setIdreserv(string $idreserv): static
    {
        $this->idreserv = $idreserv;

        return $this;
    }

    public function getIdvoit(): ?VOITURE
    {
        return $this->idvoit;
    }

    public function setIdvoit(?VOITURE $idvoit): static
    {
        $this->idvoit = $idvoit;

        return $this;
    }

    public function getIdcli(): ?CLIENT
    {
        return $this->idcli;
    }

    public function setIdcli(?CLIENT $idcli): static
    {
        $this->idcli = $idcli;

        return $this;
    }

    public function getPlace(): ?PLACE
    {
        return $this->place;
    }

    public function setPlace(?PLACE $place): static
    {
        $this->place = $place;

        return $this;
    }

    public function getDatereserv(): ?\DateTime
    {
        return $this->datereserv;
    }

    public function setDatereserv(\DateTime $datereserv): static
    {
        $this->datereserv = $datereserv;

        return $this;
    }

    public function getDatevoyage(): ?\DateTime
    {
        return $this->datevoyage;
    }

    public function setDatevoyage(\DateTime $datevoyage): static
    {
        $this->datevoyage = $datevoyage;

        return $this;
    }

    public function getPayement(): ?string
    {
        return $this->payement;
    }

    public function setPayement(?string $payement): static
    {
        $this->payement = $payement;

        return $this;
    }

    public function getMontantAvance(): ?int
    {
        return $this->montant_avance;
    }

    public function setMontantAvance(?int $montant_avance): static
    {
        $this->montant_avance = $montant_avance;

        return $this;
    }

    public function getDestination(): ?string
    {
        return $this->destination;
    }

    public function setDestination(string $destination): static
    {
        $this->destination = $destination;

        return $this;
    }
}

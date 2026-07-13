<?php

namespace App\Entity;

use App\Repository\PLACERepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: PLACERepository::class)]
class PLACE
{

    #[ORM\Id]
    #[ORM\ManyToOne]
    #[ORM\JoinColumn(name: "idvoit", referencedColumnName: "idvoit",nullable: false)]
    private ?VOITURE $idvoit = null;

    #[ORM\Id]
    #[ORM\Column]
    private ?int $place = null;

    #[ORM\Column(length: 3)]
    private ?string $occupation = null;

    public function getIdvoit(): ?VOITURE
    {
        return $this->idvoit;
    }

    public function setIdvoit(?VOITURE $idvoit): static
    {
        $this->idvoit = $idvoit;

        return $this;
    }

    public function getPlace(): ?int
    {
        return $this->place;
    }

    public function setPlace(int $place): static
    {
        $this->place = $place;

        return $this;
    }

    public function getOccupation(): ?string
    {
        return $this->occupation;
    }

    public function setOccupation(string $occupation): static
    {
        $this->occupation = $occupation;

        return $this;
    }
}

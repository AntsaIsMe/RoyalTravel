<?php

namespace App\Entity;

use App\Repository\CLIENTRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CLIENTRepository::class)]
class CLIENT
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(name: "idcli")] 
    private ?int $idcli = null;

    #[ORM\Column(length: 255)]
    private ?string $nom = null;

    #[ORM\Column(length: 13)]
    private ?string $numtel = null;


    public function getIdcli(): ?int
    {
        return $this->idcli;
    }

    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(string $nom): static
    {
        $this->nom = $nom;
        return $this;
    }

    public function getNumtel(): ?string
    {
        return $this->numtel;
    }

    public function setNumtel(string $numtel): static
    {
        $this->numtel = $numtel;
        return $this;
    }
}
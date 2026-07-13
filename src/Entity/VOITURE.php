<?php

namespace App\Entity;

use App\Repository\VOITURERepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: VOITURERepository::class)]
class VOITURE
{
    #[ORM\Id]
    #[ORM\Column(length: 100)]
    private ?string $idvoit = null;

    #[ORM\Column(length: 100)]
    private ?string $design = null;

    #[ORM\Column(length: 9)]
    private ?string $type = null;

    #[ORM\Column]
    private ?int $nbrplace = null;

    #[ORM\Column]
    private ?int $frais = null;

    public function getIdvoit(): ?string
    {
        return $this->idvoit;
    }

    public function setIdvoit(string $idvoit): static
    {
        $this->idvoit = $idvoit;

        return $this;
    }

    public function getDesign(): ?string
    {
        return $this->design;
    }

    public function setDesign(string $design): static
    {
        $this->design = $design;

        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): static
    {
        $this->type = $type;

        return $this;
    }

    public function getNbrplace(): ?int
    {
        return $this->nbrplace;
    }

    public function setNbrplace(int $nbrplace): static
    {
        $this->nbrplace = $nbrplace;

        return $this;
    }

    public function getFrais(): ?string
    {
        return $this->frais;
    }

    public function setFrais(string $frais): static
    {
        $this->frais = $frais;

        return $this;
    }
}

<?php

namespace App\Entity;

use App\Repository\TrafficDataRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: TrafficDataRepository::class)]
class TrafficData
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?int $page_id = null;

    #[ORM\Column(length: 255)]
    private ?string $page_url = null;

    #[ORM\Column]
    private ?int $traffic = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getPageId(): ?int
    {
        return $this->page_id;
    }

    public function setPageId(int $page_id): static
    {
        $this->page_id = $page_id;

        return $this;
    }

    public function getPageUrl(): ?string
    {
        return $this->page_url;
    }

    public function setPageUrl(string $page_url): static
    {
        $this->page_url = $page_url;

        return $this;
    }

    public function getTraffic(): ?int
    {
        return $this->traffic;
    }

    public function setTraffic(int $traffic): static
    {
        $this->traffic = $traffic;

        return $this;
    }
}

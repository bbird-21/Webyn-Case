<?php

namespace App\DataFixtures;

use App\Entity\TrafficData;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $pages = [
            ['1', '/home', 125],
            ['2', '/about', 80],
            ['3', '/products', 300],
            ['4', '/contact', 45],
            ['5', '/blog', 95],
        ];

        foreach ($pages as [$id, $url, $traffic]) {
            $data = new TrafficData();
            $data->setPageId($id);
            $data->setPageUrl($url);
            $data->setTraffic($traffic);

            $manager->persist($data);
        }

        $manager->flush();
    }
}

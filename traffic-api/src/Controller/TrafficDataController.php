<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;
use App\Repository\TrafficDataRepository;
// final class TrafficDataController extends AbstractController
// {
//     #[Route('/traffic/data', name: 'app_traffic_data')]
//     public function index(): JsonResponse
//     {
//         return $this->json([
//             'message' => 'Welcome to your new controller!',
//             'path' => 'src/Controller/TrafficDataController.php',
//         ]);
//     }
// }

// src\Controller\BookController.php


class TrafficDataController extends AbstractController
{
    #[Route('/api/traffic', name: 'traffic', methods: ['GET'])]
    public function getTrafficData(TrafficDataRepository $trafficDataRepository, SerializerInterface $serializer): JsonResponse
    {
        $homeTraffic = $trafficDataRepository->findAll();
        $jsonHomeTraffic = $serializer->serialize($homeTraffic, 'json', ['groups' => 'traffic']);
        return new JsonResponse($jsonHomeTraffic, Response::HTTP_OK, ['accept' => 'json'], true);

    }
}

// use App\Entity\TrafficData;
// use Doctrine\ORM\EntityManagerInterface;
// use Symfony\Component\HttpFoundation\Response;


// class TrafficDataController extends AbstractController
// {
//     #[Route('/api/traffic', name: 'create_product')]
//     public function createProduct(EntityManagerInterface $entityManager): Response
//     {
//         $product = new TrafficData();
//         $product->setPageId('1');
//         $product->setPageUrl("/home");
//         $product->setTraffic('12');

//         // tell Doctrine you want to (eventually) save the Product (no queries yet)
//         $entityManager->persist($product);

//         // actually executes the queries (i.e. the INSERT query)
//         $entityManager->flush();

//         return new Response('Saved new product with id '.$product->getId());
//     }
// }

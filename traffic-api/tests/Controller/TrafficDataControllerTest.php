<?php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class TrafficDataControllerTest extends WebTestCase
{
    public function testTrafficEndpointReturnsData(): void
    {
        $client = static::createClient();

        $client->request('GET', '/api/traffic');

        $this->assertResponseIsSuccessful(); // HTTP 200
        $this->assertResponseHeaderSame('content-type', 'application/json');

        // $content = $client->getResponse()->getContent();
        // $data = json_decode($content, true);

        // $this->assertIsArray($data);
        // $this->assertNotEmpty($data);

        // $sample = $data[0];
        // $this->assertArrayHasKey('pageId', $sample);
        // $this->assertArrayHasKey('pageUrl', $sample);
        // $this->assertArrayHasKey('traffic', $sample);
    }
}

// tests/Service/NewsletterGeneratorTest.php

// use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

// class TrafficDataControllerTest extends WebTestCase
// {
//     public function testSomething(): void
//     {
//         // This calls KernelTestCase::bootKernel(), and creates a
//         // "client" that is acting as the browser
//         $client = static::createClient();

//         // Request a specific page
//         $crawler = $client->request('GET', '/api/traffic');

//         // Validate a successful response and some content
//         $this->assertResponseIsSuccessful();
//         // $this->assertSelectorTextContains('h1', 'Hello World');
//     }
// }

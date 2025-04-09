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

        $content = $client->getResponse()->getContent();
        $data = json_decode($content, true);

        $this->assertIsArray($data);
        $this->assertNotEmpty($data);

        $sample = $data[0];
        $this->assertArrayHasKey('page_id', $sample);
        $this->assertArrayHasKey('page_url', $sample);
        $this->assertArrayHasKey('traffic', $sample);
    }
}

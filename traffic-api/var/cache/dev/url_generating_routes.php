<?php

// This file has been auto-generated by the Symfony Routing Component.

return [
    '_preview_error' => [['code', '_format'], ['_controller' => 'error_controller::preview', '_format' => 'html'], ['code' => '\\d+'], [['variable', '.', '[^/]++', '_format', true], ['variable', '/', '\\d+', 'code', true], ['text', '/_error']], [], [], []],
    'traffic' => [[], ['_controller' => 'App\\Controller\\TrafficDataController::getTrafficData'], [], [['text', '/api/traffic']], [], [], []],
    'App\Controller\TrafficDataController::getTrafficData' => [[], ['_controller' => 'App\\Controller\\TrafficDataController::getTrafficData'], [], [['text', '/api/traffic']], [], [], []],
];

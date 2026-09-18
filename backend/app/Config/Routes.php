<?php

use CodeIgniter\Router\RouteCollection;

/** @var RouteCollection $routes */
$routes->get('/', 'Home::index');

$routes->group('api', static function ($routes) {
    $routes->get('announcements', 'Api\Announcements::index');
    $routes->get('announcements/(:segment)', 'Api\Announcements::show/$1');
});

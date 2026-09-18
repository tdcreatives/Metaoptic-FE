<?php

use CodeIgniter\Router\RouteCollection;

/** @var RouteCollection $routes */
$routes->get('/', 'Home::index');

$routes->group('api', static function ($routes) {
    $routes->get('announcements', 'Api\Announcements::index');
    $routes->get('announcements/(:segment)', 'Api\Announcements::show/$1');
});

$routes->group('admin', static function ($routes) {
    $routes->get('login', 'Admin\AuthController::loginForm');
    $routes->post('login', 'Admin\AuthController::login');
    $routes->post('logout', 'Admin\AuthController::logout');

    $routes->group('', ['filter' => 'adminAuth'], static function ($routes) {
        $routes->get('/', 'Admin\Dashboard::index');
        $routes->get('announcements', 'Admin\Announcements::index');
        $routes->get('announcements/(:num)', 'Admin\Announcements::show/$1');
        $routes->post('announcements/(:num)/summary', 'Admin\Announcements::updateSummary/$1');
    });
});

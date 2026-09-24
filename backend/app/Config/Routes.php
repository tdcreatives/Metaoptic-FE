<?php

use CodeIgniter\Router\RouteCollection;

/** @var RouteCollection $routes */
$routes->get('/', 'Home::index');

$routes->group('api', static function ($routes) {
    $routes->get('announcements', 'Api\Announcements::index');
    $routes->get('announcements/(:segment)', 'Api\Announcements::show/$1');
});

$routes->post('api/subscribers', 'Api\Subscribers::create');
$routes->post('api/unsubscribe', 'Api\Unsubscribe::create');

$routes->group('admin', static function ($routes) {
    $routes->get('login', 'Admin\AuthController::loginForm');
    $routes->post('login', 'Admin\AuthController::login');
    $routes->post('logout', 'Admin\AuthController::logout');

    $routes->group('', ['filter' => 'adminAuth'], static function ($routes) {
        $routes->get('/', 'Admin\Dashboard::index');
        $routes->get('announcements', 'Admin\Announcements::index');
        $routes->get('announcements/(:num)', 'Admin\Announcements::show/$1');
        $routes->post('announcements/(:num)/summary', 'Admin\Announcements::updateSummary/$1');
        $routes->post('announcements/(:num)/publish', 'Admin\Announcements::publish/$1');
        $routes->post('announcements/(:num)/send', 'Admin\Announcements::send/$1');
        $routes->post('announcements/(:num)/archive', 'Admin\Announcements::archive/$1');
        $routes->post('campaigns/(:num)/retry-failed', 'Admin\Campaigns::retryFailed/$1');
        $routes->get('sync-runs', 'Admin\SyncRuns::index');
        $routes->get('settings/recipients', 'Admin\Settings::recipients');
        $routes->post('settings/recipients', 'Admin\Settings::updateRecipients');
    });
});

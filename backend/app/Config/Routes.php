<?php

use CodeIgniter\Router\RouteCollection;

/** @var RouteCollection $routes */
$routes->get('/', 'Home::index');

$routes->group('api', static function ($routes) {
    $routes->get('announcements', 'Api\Announcements::index');
    $routes->get('announcements/(:segment)', 'Api\Announcements::show/$1');
});

$routes->options('api/(:any)', 'Api\Preflight::options');
$routes->post('api/subscribers', 'Api\Subscribers::create');
$routes->post('api/unsubscribe', 'Api\Unsubscribe::create');

$routes->group('admin', static function ($routes) {
    $routes->get('login', 'Admin\AuthController::loginForm');
    $routes->post('login', 'Admin\AuthController::login');
    $routes->post('logout', 'Admin\AuthController::logout');

    $routes->group('', ['filter' => 'adminAuth'], static function ($routes) {
        $routes->get('/', 'Admin\Dashboard::index');
        $routes->get('announcements', 'Admin\Announcements::index');
        $routes->get('announcements/new', 'Admin\Announcements::createForm');
        $routes->post('announcements', 'Admin\Announcements::create');
        $routes->get('announcements/(:num)', 'Admin\Announcements::show/$1');
        $routes->post('announcements/(:num)/summary', 'Admin\Announcements::updateSummary/$1');
        $routes->post('announcements/(:num)/publish', 'Admin\Announcements::publish/$1');
        $routes->post('announcements/(:num)/archive', 'Admin\Announcements::archive/$1');
        $routes->post('announcements/(:num)/delete', 'Admin\Announcements::delete/$1');
        $routes->get('email-alerts', 'Admin\EmailAlerts::index');
        $routes->get('email-alerts/new', 'Admin\EmailAlerts::createForm');
        $routes->post('email-alerts', 'Admin\EmailAlerts::create');
        $routes->get('email-alerts/(:num)', 'Admin\EmailAlerts::show/$1');
        $routes->get('email-alerts/(:num)/edit', 'Admin\EmailAlerts::editForm/$1');
        $routes->post('email-alerts/(:num)', 'Admin\EmailAlerts::update/$1');
        $routes->post('email-alerts/(:num)/schedule', 'Admin\EmailAlerts::schedule/$1');
        $routes->post('email-alerts/(:num)/send-now', 'Admin\EmailAlerts::sendNow/$1');
        $routes->post('email-alerts/(:num)/cancel', 'Admin\EmailAlerts::cancel/$1');
        $routes->post('email-alerts/(:num)/delete', 'Admin\EmailAlerts::delete/$1');
        $routes->post('campaigns/(:num)/retry-failed', 'Admin\Campaigns::retryFailed/$1');
        $routes->get('sync-runs', 'Admin\SyncRuns::index');
        $routes->get('settings/recipients', 'Admin\Settings::recipients');
        $routes->post('settings/recipients', 'Admin\Settings::updateRecipients');
    });
});

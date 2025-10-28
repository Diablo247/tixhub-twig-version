<?php
require_once __DIR__ . '/vendor/autoload.php';

// Twig setup
$loader = new \Twig\Loader\FilesystemLoader(__DIR__ . '/templates');
$twig = new \Twig\Environment($loader, [
    'cache' => false,
]);

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Pages where navbar is hidden
$noNavbarPages = ['/login', '/signup'];
$twig->addGlobal('hideNavbar', in_array($path, $noNavbarPages));

switch ($path) {
    case '/':
        echo $twig->render('pages/home.twig');
        break;

    case '/signup':
        echo $twig->render('pages/signup.twig');
        break;

    case '/login':
        echo $twig->render('pages/login.twig');
        break;

    case '/dashboard':
        echo $twig->render('pages/dashboard.twig');
        break;
    case '/about':
        echo $twig->render('pages/about.twig');
        break;

    // Add tickets CRUD page later
    case '/tickets':
        echo $twig->render('pages/tickets.twig');
        break;

    default:
        http_response_code(404);
        echo $twig->render('pages/404.twig');
        break;
}

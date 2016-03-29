<?php
require_once __DIR__ . '/../vendor/autoload.php';

if ($_SERVER["REQUEST_URI"] !== '/') {
    return false;
}

$loader = new Twig_Loader_Filesystem(__DIR__ . '/templates/');
$twig = new Twig_Environment($loader,['cache' => false,]);

echo $twig->render('index.html', array('name' => 'Fabien'));
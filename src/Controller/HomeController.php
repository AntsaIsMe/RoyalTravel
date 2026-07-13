<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class HomeController extends AbstractController
{
    #[Route('/{reactRouting}', name: 'app_react_catch_all', requirements: ['reactRouting' => '^(?!api|build).*'], defaults: ['reactRouting' => null])]
    public function index(): Response
    {
        return $this->render('base.html.twig'); 
    }
}

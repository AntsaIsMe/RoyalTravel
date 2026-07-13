<?php

namespace App\Controller;

use App\Entity\CLIENT;
use App\Repository\CLIENTRepository;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use PhpParser\Node\Stmt\TryCatch;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

final class ClientController extends AbstractController
{
    #[Route('/api/client', name: 'api_client_getAll', methods:['GET'])]
    public function index(CLIENTRepository $clientRepository): JsonResponse
    {
        $clientsBrut = $clientRepository->findAll();
        $clientTab = [];

        foreach($clientsBrut as $client) {
            $format = [
                "idcli" => $client->getIdcli(),
                "nom" => $client->getNom(),
                "numéro de télephone" => $client->getNumtel()
            ];
            array_push($clientTab, $format);
        }
        return $this->json($clientTab);
    }

    #[Route('/api/client/{idcli}', name: 'api_client_getOne', methods: ['GET'])]
    public function getOne(CLIENTRepository $clientRepository,int $idcli) : JsonResponse {
        try {
            $client = $clientRepository->findOneBy(["idcli" => $idcli]);

            // if result null
            if(!$client) return $this->json(["message" => "Aucun client"], 404);


            $format = [
                "idcli" => $client->getIdcli(),
                "nom" => $client->getNom(),
                "numtel" => $client->getNumtel()
            ];

            return $this->json($format, 200);

        } catch (\Exception $e) {
            return $this->json([
                "message" => "Erreur lors de la recherche",
                'error' => $e->getMessage()
            ], 500);
        }
    }

    #[Route('/api/client', name: 'api_client_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            
            // json invalid
            if (json_last_error() !== JSON_ERROR_NONE) {
                return $this->json(['message' => 'Format JSON invalide.'], 400);
            }

            if (empty($data['nom']) || empty($data['numtel'])) {
                return $this->json(['message' => 'nom et numtel est obligatoire.'], 400);
            }

            $client = new CLIENT();
            $client->setNom($data['nom']);
            $client->setNumtel($data['numtel'] ?? null);

            // 4. Sauvegarde
            $em->persist($client);
            $em->flush();

            return $this->json([
                'message' => 'Client créé avec succès'
            ], 201);

        } catch (\Exception $e) {
            return $this->json([
                'message' => 'Une erreur est survenue lors de la création.',
                'error' => $e->getMessage() 
            ], 500);
        }
    }

    #[Route('/api/client/{idcli}', name: 'update', methods: ['PUT'])]
    public function update(CLIENTRepository $clientRepository, EntityManagerInterface $em, string $idcli, Request $req) : JsonResponse {
        try {
            $client = $clientRepository->findOneBy(['idcli' => $idcli]);
    
            if (!$client) return $this->json(["message" => "Ce client n'existe pas"], 404);
    
            $data = json_decode($req->getContent(), true);

            if (!$data) {
                return $this->json(["messsage" => "Fournir au moins un parametre"], 400);
            }

            $client->setNom($data['nom'] ?? $client->getNom());
            $client->setNumtel($data['numtel'] ?? $client->getNumtel());

            $em->flush();

            return $this->json(["message" => "Client modifié avec succes"], 200);

        } catch (\Exception $e) {
            return $this->json([
                "message" => "Erreur lors update " . $e->getMessage(),
                "error" => $e->getMessage()
            ]);
        }


    }

    #[Route('/api/client/{idcli}', name: 'delete', methods: ['DELETE'])]
    public function delete(CLIENTRepository $clientRepository, EntityManagerInterface $em, string $idcli, Request $req) : JsonResponse {
        try {
            $client = $clientRepository->findOneBy(['idcli' => $idcli]);
    
            if (!$client) return $this->json(["message" => "Ce client n'existe pas"], 404);
    
            $em->remove($client);
            $em->flush();

            return $this->json(["message" => "Client supprimé avec succes"], 200);

        } catch (\Exception $e) {
            return $this->json([
                "message" => "Erreur lors update " . $e->getMessage(),
                "error" => $e->getMessage()
            ]);
        }


    }

    // forme /api/client/search?term=SOmething
    #[Route('/api/client/search', name: 'api_client_getOne', methods: ['GET'])]
    public function search(CLIENTRepository $clientRepository, Request $req) : JsonResponse {
        try {
            $pattern = $req->query->get('term', '');
            $clients = $clientRepository->findByNomNum($pattern);

            // if result null
            // if(!$clients) return $this->json(["message" => [] . $pattern], 200);

            $client = [];

            foreach($clients as $cli){

                $format = [
                    "idcli" => $cli->getIdcli(),
                    "nom" => $cli->getNom(),
                    "numtel" => $cli->getNumtel()
                ];
                array_push($client, $format);
            }

            return $this->json($client, 200);

        } catch (\Exception $e) {
            return $this->json([
                "message" => "Erreur lors de la recherche",
                'error' => $e->getMessage()
            ], 500);
        }
    }
     
}

<?php

namespace App\Controller;

use App\Entity\PLACE;
use App\Entity\VOITURE;
use App\Repository\CLIENTRepository;
use App\Repository\PLACERepository;
use App\Repository\VOITURERepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class PLACEController extends AbstractController
{
    #[Route('/api/place', name: 'app_place', methods :['GET'])]
    public function index(PLACERepository $placeRepository): JsonResponse
    {
        $placeBrut = $placeRepository->findAll();
        $places = [];

        foreach($placeBrut as $client) {
            $format = [
                "idvoit" => $client->getIdvoit(),
                "occupation" => $client->getOccupation(),
                "place" => $client->getPlace()
            ];
            array_push($places, $format);
        }
        return $this->json($places);
    }

    #[Route('/api/place/one/', name: 'api_place_getOne', methods: ['GET'])]
    public function getOne(PLACERepository $placeRepository, Request $req) : JsonResponse {
        try {
            $idvoit = $req->query->get('idvoit', '');
            $place = $req->query->get('place', '');

            $placeT = $placeRepository->findOneBy(["idvoit" => $idvoit , "place" => $place]);

            // if result null
            if(!$placeT) return $this->json(["message" => "Aucune place trouvé"], 404);


            $format = [
                "idvoit" => $placeT->getIdvoit(),
                "occupation" => $placeT->getOccupation(),
                "place" => $placeT->getPlace()
            ];

            return $this->json($format, 200);

        } catch (\Exception $e) {
            return $this->json([
                "message" => "Erreur lors de la recherche",
                'error' => $e->getMessage()
            ], 500);
        }
    }

    #[Route('/api/place', name: 'api_place_add', methods: ['POST'])]
    public function add(Request $req, EntityManagerInterface $em, VOITURERepository $voitureRepository): JsonResponse
    {
        try {
            $data = json_decode($req->getContent(), true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                return $this->json(["message" => "JSON invalide"], 400);
            }

            if (empty($data['idvoit']) || !isset($data['place']) || empty($data['occupation'])) {
                return $this->json(["message" => "idvoit, place et occupation sont obligatoires"], 400);
            }

            $voiture = $voitureRepository->find($data['idvoit']);
            if (!$voiture) {
                return $this->json(["message" => "Cette voiture n'existe pas"], 404);
            }

            $place = $this->create($em, $voiture, (int) $data['place'], $data['occupation']);
            $em->flush();

            return $this->json([
                "message" => "Place ajoutée avec succès",
                "place" => [
                    "idvoit" => $place->getIdvoit()->getIdvoit(),
                    "place" => $place->getPlace(),
                    "occupation" => $place->getOccupation()
                ]
            ], 201);

        } catch (\Exception $e) {
            return $this->json([
                "message" => "Erreur lors de l'ajout de la place",
                "error" => $e->getMessage()
            ], 500);
        }
    }

    // Called on VoitureController
    public function create(EntityManagerInterface $em, VOITURE $voiture, int $place, string $occupation = "NON"): PLACE
    {
        // if place exist or not
        $placeExist = $em->getRepository(PLACE::class)->findOneBy([
            "idvoit" => $voiture,
            "place" => $place
        ]);

        if ($placeExist) {
            throw new \InvalidArgumentException("La place {$place} existe déjà pour la voiture {$voiture->getIdvoit()}");
        }

        $newPlace = new PLACE();
        $newPlace->setIdvoit($voiture);
        $newPlace->setPlace($place);
        $newPlace->setOccupation($occupation);

        $em->persist($newPlace);

        return $newPlace;
    }

    /**
 * Route HTTP publique pour modifier l'occupation d'une place.
 */
#[Route('/api/place', name: 'api_place_update', methods: ['PATCH'])]
public function updateHttp(PLACERepository $placeRepository, VOITURERepository $voitureRepository, EntityManagerInterface $em, Request $req): JsonResponse
{
    try {
        $data = json_decode($req->getContent(), true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            return $this->json(["message" => "JSON invalide"], 400);
        }

        if (empty($data['idvoit']) || !isset($data['place']) || !isset($data['occupation'])) {
            return $this->json(["message" => "idvoit, place et occupation sont obligatoires"], 400);
        }

        $voiture = $voitureRepository->find($data['idvoit']);
        if (!$voiture) {
            return $this->json(["message" => "Cette voiture n'existe pas"], 404);
        }

        $placeT = $placeRepository->findOneBy(["idvoit" => $voiture, "place" => (int) $data['place']]);
        if (!$placeT) {
            return $this->json(["message" => "Cette place n'existe pas"], 404);
        }

        $this->update($placeRepository, $em, $voiture, $placeT, (string) $data['occupation']);
        $em->flush();

        return $this->json(["message" => "Place modifiée avec succès"], 200);

    } catch (\Exception $e) {
        return $this->json([
            "message" => "Erreur lors de la modification",
            "error" => $e->getMessage()
        ], 500);
    }
}

/**
 * Méthode interne réutilisable (appelée depuis RESERVERController pour occuper/libérer
 * une place lors d'une réservation, mise à jour ou suppression).
 * Ne fait PAS de flush : c'est à l'appelant de flush une fois toutes les opérations terminées.
 * Prend directement l'entité PLACE déjà récupérée par l'appelant (pas de re-recherche inutile).
 */
public function update(PLACERepository $placeRepository, EntityManagerInterface $em, VOITURE $voiture, PLACE $place, string $occupation): void
{
    $place->setOccupation($occupation);
}

    #[Route('/api/place', name: 'app_place_delete', methods:["DELETE"])]
    public function delete(PLACERepository $placeRep,  EntityManagerInterface $em, VOITURE $voiture ,int $place): JsonResponse
    {
        try {
            // $data = json_decode($req->getContent(), true);

            // if(empty($data['idvoit']) || empty($data['place'])){
            //     return $this->json(["message" => "idvoit et place obligatoire"], 404);
            // }
            // $voiture = $placeRep->findOneBy([
            //     "idvoit" => $data['idvoit'],
            //     "place" => $data['place']
            // ]);

            // if(!$voiture) return $this->json(['message' => "Cette voiture n'extiste pas"] ,404);
            $placeRem = $placeRep->findOneBy([
                    "idvoit" => $voiture,
                    "place" => $place
                ]);
            $em->remove($placeRem);
            $em->flush();
            
            return $this->json(["message" => "Place supprimée"], 201);


        } catch (\Exception $e) {
            return $this->json([
                "message" => "Erreur lors du listage" . $e->getMessage(),
                "error" => $e->getMessage()
            ], 500);
        }
    }

    #[Route('/api/place/voiture/{idvoit}', name: 'api_place_getByVoiture', methods: ['GET'])]
public function getByVoiture(PLACERepository $placeRepository, VOITURERepository $voitureRepository, string $idvoit): JsonResponse
{
    try {
        // Vérifie que la voiture existe
        $voiture = $voitureRepository->find($idvoit);
        if (!$voiture) {
            return $this->json(["message" => "Cette voiture n'existe pas"], 404);
        }

        $placesBrut = $placeRepository->findBy(
            ["idvoit" => $voiture],
            ["place" => "ASC"] // tri par numéro de place
        );

        $places = [];
        foreach ($placesBrut as $place) {
            $places[] = [
                "idvoit" => $place->getIdvoit()->getIdvoit(),
                "place"  => $place->getPlace(),
                "occupe" => (bool) $place->getOccupation() // Changé de "occupation" à "occupe" + cast en booléen
            ];
        }

        // Suppression des crochets superflus autour de $places pour envoyer un tableau propre
        return $this->json($places, 200);

    } catch (\Exception $e) {
        return $this->json([
            "message" => "Erreur lors de la recherche des places",
            "error" => $e->getMessage()
        ], 500);
    }
}
        
}

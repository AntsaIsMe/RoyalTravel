<?php

namespace App\Controller;

use App\Entity\PLACE;
use App\Entity\VOITURE;
use App\Repository\PLACERepository;
use App\Repository\VOITURERepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

final class VoitureController extends AbstractController
{
    #[Route('/api/voiture', name: 'api_voiture_getAll', methods:['GET'])]
    public function getAll(VOITURERepository $voitureRep): JsonResponse
    {
        try {
            $voitures = $voitureRep->findAll();

            if (!$voitures) return $this->json(["message" => "Pas de voiture"], 204);

            $voitFormated = [];

            foreach($voitures as $voiture){
                $format = [
                    "matricule" => $voiture->getIdvoit(),
                    "design" => $voiture->getDesign(),
                    "type" => $voiture->getType(),
                    "frais" => $voiture->getFrais(),
                    "Nombre de place" => $voiture->getNbrplace()
                ];
                array_push($voitFormated ,$format);
            }

            return $this->json($voitFormated, 200);

        } catch (\Exception $e) {
            return $this->json([
                "message" => "Erreur lors du listage" . $e->getMessage(),
                "error" => $e->getMessage()
            ], 500);
        }
    }
    #[Route('/api/voiture/search', name: 'app_voiture_search', methods: ['GET'])]
    public function search(Request $request, VOITURERepository $voitureRep): JsonResponse
    {
        try {
            $term = $request->query->get('term', '');

            if (empty(trim($term))) {
                return $this->json([], 200);
            }

            // Appel de la méthode de recherche personnalisée dans le Repository
            $voituresTrouvees = $voitureRep->searchByTerm($term);

            $data = [];
            foreach ($voituresTrouvees as $v) {
                $data[] = [
                    "idvoit"   => $v->getIdvoit(),
                    "design"   => $v->getDesign(),
                    "frais"    => $v->getFrais(),
                    "nbrplace" => $v->getNbrplace()
                ];
            }

            return $this->json($data, 200);

        } catch (\Exception $e) {
            return $this->json([
                "message" => "Erreur lors de la recherche : " . $e->getMessage(),
            ], 500);
        }
    }
    #[Route('/api/voiture/{idvoit}', name: 'app_voiture_getOne', methods:['GET'])]
    public function getOne(VOITURERepository $voitureRep, string $idvoit): JsonResponse
    {
        try {
            $voitures = $voitureRep->findOneBy(["idvoit" => $idvoit]);

            if (!$voitures) return $this->json(["message" => "Cette voiture n'existe pas"], 404);

                $voiture = [
                    "idvoit" => $voitures->getIdvoit(),
                    "design" => $voitures->getDesign(),
                    "type" => $voitures->getNbrplace(),
                    "frais" => $voitures->getFrais(),
                    "nbrplace" => $voitures->getNbrplace()

                ];

            return $this->json($voiture, 200);

        } catch (\Exception $e) {
            return $this->json([
                "message" => "Erreur lors du listage" . $e->getMessage(),
                "error" => $e->getMessage()
            ], 500);
        }
    }

    

    #[Route('/api/voiture', name: 'app_voiture_create', methods:['POST'])]
    public function create(VOITURERepository $voitureRep, Request $req, EntityManagerInterface $em, PLACEController $placeContr): JsonResponse
    {
        try {
            $data = json_decode($req->getContent(), true);

            if (empty($data['idvoit']) || empty($data['design']) || empty($data['frais']) ||
                empty($data['nbrplace']) || empty($data['type'])) {
                return $this->json(["message" => "Tous les champs sont obligatoires",
                    "there" => $data] ,400);
            }

            $voitureCheck = $voitureRep->findOneBy(["idvoit" => $data['idvoit']]);
            if($voitureCheck) return $this->json(['message' => "Cette voiture existe deja"] ,409);

            $voiture = new VOITURE();
            $voiture->setIdvoit($data['idvoit']);
            $voiture->setDesign($data['design']);
            $voiture->setFrais($data['frais']);
            $voiture->setNbrplace($data['nbrplace']);
            $voiture->setType($data['type']);

            $em->persist($voiture);

            for ($i=1; $i <= $data["nbrplace"]; $i++) { 
                $placeContr->create($em, $voiture, $i);
            }
            $em->flush();
            
            return $this->json(["message" => "Voiture ajoute"], 201);


        } catch (\Exception $e) {
            return $this->json([
                "message" => "Erreur lors du listage" . $e->getMessage(),
                "error" => $e->getMessage()
            ], 500);
        }
    }

    #[Route('/api/voiture/{idvoit}', name: 'app_voiture_update', methods:['PUT'])]
    public function update(VOITURERepository $voitureRep, Request $req, EntityManagerInterface $em, PLACEController $placeContr, PLACERepository $placeRep, string $idvoit): JsonResponse
    {
        try {
            $data = json_decode($req->getContent(), true);
            // return $this->json($idvoit,400);
            $voiture = $voitureRep->findOneBy(["idvoit" => $idvoit]);

            if(empty($data['idvoit']) && empty($data['design']) && empty($data['frais'])
                && empty($data['nbrplace']) && empty($data['type'])){
                    return $this->json(['message' => "Fournir au moins 1 argument"] ,404);
            }

            if(!$voiture) return $this->json(['message' => "Cette voiture n'extiste pas"] ,404);
            // dd($idvoit);

            if (!empty($data["idvoit"])) {
                $voitureT = $voitureRep->findOneBy(["idvoit" => $data['idvoit']]);
                if($voitureT) return $this->json(['message' => "Une voiture avec cette matricule existe deja"] ,400);
            }

            $nbrplaceOld = $voiture->getNbrplace();
            $nbrplaceNew = isset($data['nbrplace']) ? (int)$data['nbrplace'] : $nbrplaceOld;

            $voiture->setIdvoit($data['idvoit'] ?? $voiture->getIdvoit());
            $voiture->setDesign($data['design']?? $voiture->getDesign());
            $voiture->setFrais($data['frais'] ?? $voiture->getFrais());
            $voiture->setNbrplace($nbrplaceNew);
            $voiture->setType($data['type']?? $voiture->getType());

            $em->persist($voiture);
            if ($nbrplaceNew > $nbrplaceOld) {
                for ($i=$nbrplaceOld + 1; $i <= $nbrplaceNew ; $i++) { 
                    $placeContr->create($em, $voiture, $i);
                }
            }
            else if ($nbrplaceNew < $nbrplaceOld) {
                for ($i=$nbrplaceNew + 1; $i <= $nbrplaceOld ; $i++) { 
                    $placeContr->delete($placeRep, $em, $voiture, $i);
                }
            }

            $em->flush();
            
            return $this->json(["message" => "Voiture modifié"], 201);


        } catch (\Exception $e) {
            return $this->json([
                "message" => "Erreur lors du listage" . $e->getMessage(),
                "error" => $e->getMessage()
            ], 500);
        }
    }
    
    #[Route('/api/voiture/{idvoit}', name: 'app_voiture_delete', methods:['DELETE'])]
    public function delete(VOITURERepository $voitureRep,PLACERepository $placeRep ,PLACEController $placeContr, Request $req, EntityManagerInterface $em, string $idvoit): JsonResponse
    {
        // return $this->json(["message" => "Voiture supprimée"], 201);

        try {
            $data = json_decode($req->getContent(), true);
            $voiture = $voitureRep->findOneBy(["idvoit" => $idvoit]);

            if(!$voiture) return $this->json(['message' => "Cette voiture n'extiste pas"] ,404);
 
            $nbrPlace = $data["nbrplace"] ?? $voiture->getNbrplace();
            for ($i=1; $i <= $nbrPlace; $i++) { 
                $placeContr->delete($placeRep, $em, $voiture, $i);
            }
            $em->remove($voiture);
            $em->flush();
            
            return $this->json(["message" => "Voiture supprimée"], 201);


        } catch (\Exception $e) {
            return $this->json([
                "message" => "Erreur lors du delete " . $e->getMessage(),
                "error" => $e->getMessage()
            ], 500);
        }
    }


}

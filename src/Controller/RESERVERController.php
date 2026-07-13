<?php

namespace App\Controller;

use App\Repository\CLIENTRepository;
use App\Repository\PLACERepository;
use App\Repository\RESERVERRepository;
use App\Repository\VOITURERepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;

final class RESERVERController extends AbstractController
{
    #[Route('/api/reservation', name: 'app_reservation', methods: ['GET'])]
    public function index(RESERVERRepository $resRep, Request $req): JsonResponse
    {
        try {
            $type = trim(urldecode($req->query->get('type', '')));

            $queryBuilder = $resRep->createQueryBuilder('r')
                ->select('r.idreserv, v.idvoit, c.idcli, c.nom, r.datereserv, r.datevoyage, r.payement, r.montant_avance')
                ->addSelect('p.place as num_place')
                ->join('r.idvoit', 'v')
                ->join('r.idcli', 'c')
                ->join('r.place', 'p', 'WITH', 'p.idvoit = v.idvoit');

                // Filter 
            if (!empty($type)) {
                switch ($type) {
                    case 'Tout payé':
                        $queryBuilder->andWhere("r.payement = :payementComplet")
                            ->setParameter('payementComplet', 'Tout payé');
                        break;
                
                    case 'Sans avance':
                    case 'sans_avance':
                        $queryBuilder->andWhere(
                            "r.payement = :sansAvance OR (r.payement = :avecAvance AND (r.montant_avance = 0 OR r.montant_avance IS NULL))"
                        )
                        ->setParameter('sansAvance', 'Sans avance')
                        ->setParameter('avecAvance', 'Avec avance');
                        break;
                
                    case 'Avec avance':
                    case 'avance':
                        $queryBuilder->andWhere('r.payement = :avecAvanceText AND r.montant_avance > 0')
                            ->setParameter('avecAvanceText', 'Avec avance');
                        break;
                
                    default:
                        break;
                }
            }

            // 3. On génère la Query FINALE ici
            $query = $queryBuilder->getQuery();
            $resBrut = $query->getScalarResult();

            if (empty($resBrut)) {
                return $this->json([], 200);
            }

            $reservation = [];

            foreach ($resBrut as $res) {
                if (!isset($res['idreserv'], $res['idvoit'], $res['idcli'], $res['nom'], $res['num_place'])) {
                    continue; // Évite de faire planter toute l'API pour une seule ligne corrompue
                }

                $datereserv = null;
                $datevoyage = null;

                // Gestion robuste des dates (chaîne ou objet DateTime)
                if (!empty($res['datereserv'])) {
                    $datereserv = $res['datereserv'] instanceof \DateTimeInterface 
                        ? $res['datereserv']->format('Y-m-d H:i:s') 
                        : (new \DateTime($res['datereserv']))->format('Y-m-d H:i:s');
                }

                if (!empty($res['datevoyage'])) {
                    $datevoyage = $res['datevoyage'] instanceof \DateTimeInterface 
                        ? $res['datevoyage']->format('Y-m-d') 
                        : (new \DateTime($res['datevoyage']))->format('Y-m-d');
                }

                $reservation[] = [
                    "idreserv"            => $res['idreserv'],
                    "matricule"           => $res['idvoit'],
                    "idcli"               => $res['idcli'],
                    "nom"                 => $res['nom'],
                    "place"               => (int)$res['num_place'],
                    "date de réservation" => $datereserv,
                    "date de voyage"      => $datevoyage,
                    "payement"            => $res['payement'] ?? null,
                    "montant de l'avance" => (int)($res['montant_avance'] ?? 0)
                ];
            }

            return $this->json($reservation, 200);

        } catch (\Exception $e) {
            return $this->json([
                'error'   => 'Une erreur est survenue lors de la récupération des réservations',
                'details' => $e->getMessage()
            ], 500);
        }
    }


    #[Route('/api/reservation/{idreserv}', name: 'app_reservation_getOne', methods:['GET'])]
    public function getOne(RESERVERRepository $resRep, string $idreserv): JsonResponse
    {
        try {
            // Validation du paramètre idreserv
            if (empty($idreserv)) {
                return $this->json([
                    'error' => 'Paramètre idreserv requis'
                ], 400);
            }

            $query = $resRep->createQueryBuilder('r')
                ->select('r.idreserv, v.idvoit, c.idcli, c.nom, c.numtel, r.datereserv, r.datevoyage, r.payement, r.montant_avance')
                ->addSelect('p.place as num_place')
                ->join('r.idvoit', 'v')
                ->join('r.idcli', 'c')
                ->join('r.place', 'p', 'WITH', 'p.idvoit = v.idvoit')
                ->where('r.idreserv = :val')
                ->setParameter('val', $idreserv)
                ->getQuery();

            $resBrut = $query->getScalarResult();

            if (empty($resBrut)) {
                return $this->json([
                    'error' => 'Aucune réservation trouvée',
                    'idreserv' => $idreserv
                ], 404);
            }

            $reservation = [];

            foreach($resBrut as $res) {
                try {
                    // Vérification que tous les champs requis existent
                    if (!isset($res['idreserv'], $res['idvoit'], $res['idcli'], $res['nom'], $res['num_place'])) {
                        throw new \Exception('Données incomplètes dans la réservation');
                    }

                    $datereserv = null;
                    $datevoyage = null;

                    // Gestion de la conversion des dates
                    if (!empty($res['datereserv'])) {
                        try {
                            $datereserv = (new \DateTime($res['datereserv']))->format('Y-m-d H:i:s');
                        } catch (\Exception $e) {
                            throw new \Exception('Format de date invalide pour datereserv: ' . $res['datereserv']);
                        }
                    }

                    if (!empty($res['datevoyage'])) {
                        try {
                            $datevoyage = (new \DateTime($res['datevoyage']))->format('Y-m-d');
                        } catch (\Exception $e) {
                            throw new \Exception('Format de date invalide pour datevoyage: ' . $res['datevoyage']);
                        }
                    }

                    $format = [
                        "idreserv"       => $res['idreserv'],
                        "idvoit"         => $res['idvoit'],
                        "idcli"          => $res['idcli'],
                        "nom"            => $res['nom'],
                        "numtel"         => $res['numtel'],
                        "place"          => (int)$res['num_place'],
                        "datereserv"     => $datereserv,
                        "datevoyage"     => $datevoyage,
                        "payement"       => $res['payement'] ?? null,
                        "montant_avance" => (int)($res['montant_avance'] ?? 0)
                    ];
                    array_push($reservation, $format);
                } catch (\Exception $e) {
                    return $this->json([
                        'error' => 'Erreur lors du traitement des données de réservation',
                        'details' => $e->getMessage()
                    ], 400);
                }
            }

            return $this->json($reservation[0], 200);

        } catch (\Doctrine\ORM\Exception\RepositoryException $e) {
            return $this->json([
                'error' => 'Erreur d\'accès au dépôt',
                'details' => $e->getMessage()
            ], 500);
        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Une erreur est survenue lors de la récupération de la réservation',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    #[Route('/api/reservation', name: 'api_reservations_create', methods: ['POST'])]
    public function create(
        Request $req,
        EntityManagerInterface $em,
        VOITURERepository $voitureRep,
        CLIENTRepository $clientRep,
        PLACERepository $placeRep,
        PLACEController $placeContr
    ): JsonResponse {
        try {
            $data = json_decode($req->getContent(), true);

            // 1. Validation des données obligatoires (Ajout de destination ici)
            if (empty($data['idcli']) || empty($data['idvoit']) || empty($data['place']) || empty($data['destination'])) {
                return $this->json(['message' => "Données manquantes (idcli, idvoit, place et destination sont obligatoires)"], 400);
            }

            // 2. Vérification du Client
            $client = $clientRep->findOneBy(['idcli' => $data['idcli']]);
            if (!$client) {
                return $this->json(['message' => "Erreur Clé Étrangère : Le client avec l'ID {$data['idcli']} n'existe pas."], 404);
            }

            // 3. Vérification de la Voiture
            $voiture = $voitureRep->findOneBy(['idvoit' => $data['idvoit']]);
            if (!$voiture) {
                return $this->json(['message' => "Erreur Clé Étrangère : La voiture avec le matricule {$data['idvoit']} n'existe pas."], 404);
            }

            // 4. Vérification de la Place
            $place = $placeRep->findOneBy([
                'idvoit' => $data['idvoit'],
                'place' => (int)$data['place']
            ]);
            if (!$place) {
                return $this->json(['message' => "Erreur : La place n°{$data['place']} n'existe pas pour cette voiture."], 404);
            }

            // 5. Vérification si la place est déjà occupée
            if ($place->getOccupation() === 'oui') {
                return $this->json(['message' => "Erreur : La place n°{$data['place']} de cette voiture est déjà réservée."], 400);
            }

            // 6. Génération automatique de l'ID Unique (R + Jour + Place + 2 Chars Random)
            $jour = (new \DateTime())->format('d');
            $numPlace = (int)$data['place'];
            $random = substr(str_shuffle('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'), 0, 2);
            $numRes = 'R-' . $jour . $numPlace . $random;

            // Préparation des formats de données
            $dateReserv = (new \DateTime())->format('Y-m-d H:i:s');
            $dateVoyage = (new \DateTime($data['datevoyage'] ?? 'now'))->format('Y-m-d H:i:s');
            $payement = $data['payement'] ?? 'sans avance';
            $montantAvance = isset($data['montant_avance']) ? (int)$data['montant_avance'] : 0;
            $destination = trim($data['destination']); // Nettoyage de la chaîne de caractères

            // 7. INSERTION VIA SQL PUR (Inclusion de la colonne destination)
            $conn = $em->getConnection();
            $sql = 'INSERT INTO reserver (idreserv, idcli, idvoit, place, datereserv, datevoyage, payement, montant_avance, destination) 
                    VALUES (:idreserv, :idcli, :idvoit, :place, :datereserv, :datevoyage, :payement, :montant_avance, :destination)';
            
            $conn->executeStatement($sql, [
                'idreserv'       => $numRes,
                'idcli'          => $client->getIdcli(),
                'idvoit'         => $voiture->getIdvoit(),
                'place'          => $numPlace,
                'datereserv'     => $dateReserv,
                'datevoyage'     => $dateVoyage,
                'payement'       => $payement,
                'montant_avance' => $montantAvance,
                'destination'    => $destination // Envoi de la valeur obligatoire
            ]);

            // 8. Mise à jour de l'état de la place via votre contrôleur dédié
            $placeContr->update($placeRep, $em, $voiture, $place, "oui");
            $em->flush();

            return $this->json([
                "success" => true,
                "message" => "Réservation {$numRes} enregistrée avec succès pour la destination {$destination}. La place n°{$data['place']} est occupée."
            ], 201);

        } catch (\Exception $e) {
            return $this->json([
                "message" => "Erreur lors du traitement de la réservation",
                "error" => $e->getMessage()
            ], 500);
        }
    }

    #[Route('/api/reservation/{idreserv}', name: 'api_reservations_update', methods: ['PUT'])]
    public function update(
        string $idreserv,
        Request $req,
        EntityManagerInterface $em,
        VOITURERepository $voitureRep,
        RESERVERRepository $resRep,
        PLACERepository $placeRep,
        PLACEController $placeContr
    ): JsonResponse {
        try {
            $data = json_decode($req->getContent(), true);

            // get res
            $oldReservation = $resRep->createQueryBuilder('r')
                ->select('IDENTITY(r.idvoit) as idvoit', 'IDENTITY(r.place) as place_num')
                ->where('r.idreserv = :id')
                ->setParameter('id', $idreserv)
                ->getQuery()
                ->getOneOrNullResult();

            if (!$oldReservation) {
                return $this->json(['message' => "Cette réservation n'existe pas."], 404);
            }

            // change idvoit if exist
            $idvoitNew = $data['idvoit'] ?? $oldReservation['idvoit'];
            $voiture = $voitureRep->findOneBy(['idvoit' => $idvoitNew]);
            if (!$voiture) {
                return $this->json(['message' => "Erreur : La voiture avec le matricule {$idvoitNew} n'existe pas."], 404);
            }

            // 3. Gestion et Vérification de la Place
            $placeNumNew = isset($data['place']) ? (int)$data['place'] : (int)$oldReservation['place_num'];

            // Si la voiture OU la place a changé, on gère la permutation des places
            if ($idvoitNew !== $oldReservation['idvoit'] || $placeNumNew !== (int)$oldReservation['place_num']) {
                
                // A. Est-ce que la nouvelle place existe ?
                $nouvellePlace = $placeRep->findOneBy([
                    'idvoit' => $idvoitNew,
                    'place' => $placeNumNew
                ]);

                if (!$nouvellePlace) {
                    return $this->json(['message' => "Erreur : La place n°{$placeNumNew} n'existe pas pour la voiture {$idvoitNew}."], 404);
                }

                // B. Est-ce que la nouvelle place est libre ?
                if ($nouvellePlace->getOccupation() === 'oui') {
                    return $this->json(['message' => "Erreur : La place n°{$placeNumNew} de cette voiture est déjà occupée."], 400);
                }

                // C. Libérer l'ancienne place
                $anciennePlace = $placeRep->findOneBy([
                    'idvoit' => $oldReservation['idvoit'],
                    'place' => (int) $oldReservation['place_num']
                ]);

                if ($anciennePlace) {
                    $placeContr->update(
                        $placeRep,
                        $em,
                        $voitureRep->findOneBy(['idvoit' => $oldReservation['idvoit']]),
                        $anciennePlace,
                        "non"
                    );
                }

                // D. Occuper la nouvelle place
                $placeContr->update(
                    $placeRep,
                    $em,
                    $voiture,
                    $nouvellePlace,
                    "oui"
                );
            }

            // 4. METTRE À JOUR LA RÉSERVATION DIRECTEMENT EN SQL (Contourne l'ORM et ses objets complexes)
            $updateQuery = $em->createQueryBuilder()
                ->update('App\Entity\RESERVER', 'r')
                // Modification des valeurs scalaires simples
                ->set('r.idvoit', ':idvoit')
                ->set('r.place', ':place')
                ->setParameter('idvoit', $idvoitNew)
                ->setParameter('place', $placeNumNew);

            // Modification optionnelle de la date
            if (!empty($data['datevoyage'])) {
                $updateQuery->set('r.datevoyage', ':datevoyage')
                            ->setParameter('datevoyage', new \DateTime($data['datevoyage']));
            }

            // Modification optionnelle du paiement
            if (isset($data['payement'])) {
                $updateQuery->set('r.payement', ':payement')
                            ->setParameter('payement', $data['payement']);
            }

            // Modification optionnelle du montant de l'avance
            if (isset($data['montant_avance'])) {
                $updateQuery->set('r.montant_avance', ':montant_avance')
                            ->setParameter('montant_avance', (int)$data['montant_avance']);
            }

            // Exécution de la mise à jour globale
            $updateQuery->where('r.idreserv = :id')
                ->setParameter('id', $idreserv)
                ->getQuery()
                ->execute();

            // Flush final pour appliquer l'occupation de la nouvelle place
            $em->flush();

            return $this->json([
                "success" => true,
                "message" => "Réservation mise à jour avec succès et états des places synchronisés."
            ], 200);

        } catch (\Exception $e) {
            return $this->json([
                "message" => "Erreur lors de la modification de la réservation",
                "error" => $e->getMessage()
            ], 500);
        }
    }

    #[Route('/api/reservation/{idreserv}', name: 'app_reservation_delete', methods:['DELETE'])]
    public function delete(
        RESERVERRepository $resRep, 
        string $idreserv, 
        EntityManagerInterface $em
        ): JsonResponse {
            try {
                if (empty($idreserv)) {
                    return $this->json(['error' => 'Paramètre idreserv requis'], 400);
                }

                // 1. Éviter le find() : On récupère uniquement le matricule et le numéro de place via IDENTITY
                $reservationData = $resRep->createQueryBuilder('r')
                    ->select('IDENTITY(r.idvoit) as idvoit', 'IDENTITY(r.place) as place_num')
                    ->where('r.idreserv = :id')
                    ->setParameter('id', $idreserv)
                    ->getQuery()
                    ->getOneOrNullResult();

                if (!$reservationData) {
                    return $this->json([
                        'error' => 'Aucune réservation trouvée',
                        'idreserv' => $idreserv
                    ], 404);
                }

                // 2. Libération de la place avec un UPDATE SQL direct (sans charger l'objet PLACE)
                $em->createQueryBuilder()
                    ->update('App\Entity\PLACE', 'p')
                    ->set('p.occupation', ':statut')
                    ->where('p.idvoit = :idvoit')
                    ->andWhere('p.place = :num_place')
                    ->setParameter('statut', 'non')
                    ->setParameter('idvoit', $reservationData['idvoit'])
                    ->setParameter('num_place', (int)$reservationData['place_num'])
                    ->getQuery()
                    ->execute();

                // 3. Suppression de la réservation avec un DELETE SQL direct (sans charger l'objet RESERVER)
                $resRep->createQueryBuilder('r')
                    ->delete()
                    ->where('r.idreserv = :id')
                    ->setParameter('id', $idreserv)
                    ->getQuery()
                    ->execute();

                return $this->json([
                    'message' => 'Réservation supprimée avec succès et place libérée.',
                    'idreserv' => $idreserv
                ], 200);

            } catch (\Exception $e) {
                return $this->json([
                    'error' => 'Une erreur est survenue lors de la suppression de la réservation',
                    'details' => $e->getMessage()
                ], 500);
            }
    }

    #[Route('/api/recette/totale', name: 'api_recette_totale', methods: ['GET'])]
    public function getRecetteTotale(EntityManagerInterface $em): JsonResponse
    {
        try {
            // On calcule la somme de la colonne montant_avance
            $query = $em->createQueryBuilder()
                ->select('SUM(r.montant_avance) as recette_totale')
                ->from('App\Entity\RESERVER', 'r')
                ->getQuery();

            $resultat = $query->getSingleResult();
            
            // Sécurité si la table est vide, pour renvoyer 0 au lieu de null
            $recetteTotale = $resultat['recette_totale'] ? (int)$resultat['recette_totale'] : 0;

            return $this->json([
                "success" => true,
                "recette_totale" => $recetteTotale,
            ], 200);

        } catch (\Exception $e) {
            return $this->json([
                "message" => "Erreur lors du calcul de la recette",
                "error" => $e->getMessage()
            ], 500);
        }
    }

    #[Route('/api/clients/statut-paiement', name: 'api_clients_statut_paiement', methods: ['GET'])]
    public function getClientsByPaymentStatus(EntityManagerInterface $em): JsonResponse
    {
        try {
            $query = $em->createQueryBuilder()
                ->select("
                    c.idcli, 
                    c.nom, 
                    CASE 
                        WHEN r.payement = 'complet' OR r.payement = 'total' THEN 'Tout payé'
                        WHEN r.payement = 'sans avance' OR (r.payement = 'avance' AND r.montant_avance = 0) THEN 'Pas encore'
                        WHEN r.payement = 'avance' AND r.montant_avance > 0 THEN 'Avance avec reste'
                        ELSE 'Autre'
                    END as statut_paiement,
                    COUNT(r.idreserv) as nb_reservations
                ")
                ->from('App\Entity\RESERVER', 'r')
                ->join('r.idcli', 'c')
                ->groupBy('c.idcli, c.nom, statut_paiement')
                ->getQuery();

            $resultatsBruts = $query->getScalarResult();

            $data = [
                "tout_paye" => ["nb" => 0, "clients" => []],
                "pas_encore" => ["nb" => 0, "clients" => []],
                "avance_avec_reste" => ["nb" => 0, "clients" => []],
            ];

            foreach ($resultatsBruts as $row) {
                $clientData = [
                    "idcli" => $row['idcli'],
                    "nom" => $row['nom'],
                    "nb_reservations" => (int)$row['nb_reservations']
                ];

                if ($row['statut_paiement'] === 'Tout payé') {
                    $data['tout_paye']['clients'][] = $clientData;
                } elseif ($row['statut_paiement'] === 'Pas encore') {
                    $data['pas_encore']['clients'][] = $clientData;
                } elseif ($row['statut_paiement'] === 'Avance avec reste') {
                    $data['avance_avec_reste']['clients'][] = $clientData;
                }
            }

            // On compte le nombre unique de clients par catégorie
            $data['tout_paye']['nb'] = count($data['tout_paye']['clients']);
            $data['pas_encore']['nb'] = count($data['pas_encore']['clients']);
            $data['avance_avec_reste']['nb'] = count($data['avance_avec_reste']['clients']);

            return $this->json($data, 200);

        } catch (\Exception $e) {
            return $this->json([
                "message" => "Erreur lors de la recherche des clients",
                "error" => $e->getMessage()
            ], 500);
        }
    }

    #[Route('/api/reservation/{idreserv}/pdf', name: 'api_reservation_pdf', methods: ['GET'])]
    public function generateReceiptPdf(string $idreserv, RESERVERRepository $resRep): Response
    {
        try {
            //code...
        
        $reservation = $resRep->createQueryBuilder('r')
            ->select('r.idreserv', 'v.idvoit', 'c.nom', 'c.numtel', 'r.datereserv', 'r.datevoyage', 'r.payement', 'r.montant_avance', 'r.destination')
            ->addSelect('IDENTITY(r.place) as place_num')
            ->join('r.idvoit', 'v')
            ->join('r.idcli', 'c')
            ->where('r.idreserv = :id')
            ->setParameter('id', $idreserv)
            ->getQuery()
            ->getOneOrNullResult();

        if (!$reservation) {
            return $this->json(['message' => "Réservation non trouvée"], 404);
        }

        $fraisTotal = 50000; 
        $avance = (int)$reservation['montant_avance'];
        $reste = $fraisTotal - $avance;

        // structure
        $htmlContent = "
            <!DOCTYPE html>
            <html lang='fr'>
            <head>
                <meta charset='UTF-8'>
                <style>
                    @page {
                        size: A4;
                        margin: 20mm 15mm;
                    }
                    body {
                        font-family: 'Helvetica Neue', Arial, sans-serif;
                        color: #333333;
                        line-height: 1.6;
                    }
                    .receipt-box {
                        max-width: 650px;
                        margin: 0 auto;
                        border: 1px dashed #aaaaaa;
                        padding: 30px;
                        background-color: #fafafa;
                    }
                    .header {
                        text-align: right;
                        font-size: 16pt;
                        font-weight: bold;
                        margin-bottom: 35px;
                        color: #111111;
                    }
                    .info-row {
                        margin-bottom: 14px;
                        font-size: 11pt;
                        border-bottom: 1px solid #eaeaea;
                        padding-bottom: 6px;
                    }
                    .label {
                        font-weight: bold;
                        display: inline-block;
                        width: 180px;
                        color: #555555;
                    }
                    .value {
                        color: #000000;
                    }
                    .highlight {
                        font-weight: bold;
                    }
                </style>
            </head>
            <body>
                <div class='receipt-box'>
                    <div class='header'>Reçu N°" . htmlspecialchars($reservation['idreserv']) . "</div>
                    
                    <div class='info-row'>
                        <span class='label'>Date du réservation :</span>
                        <span class='value'>" . ($reservation['datereserv'] ? $reservation['datereserv']->format('d M Y') : '') . "</span>
                    </div>
                    
                    <div class='info-row'>
                        <span class='label'>Date du voyage :</span>
                        <span class='value'>" . ($reservation['datevoyage'] ? $reservation['datevoyage']->format('d M Y') : '') . "</span>
                    </div>
                    
                    <div class='info-row'>
                        <span class='label'>Nom du Client :</span>
                        <span class='value highlight'>" . htmlspecialchars($reservation['nom']) . "</span>
                        <span style='color: #777; margin-left: 15px;'>/ Contact :</span>
                        <span class='value'>" . htmlspecialchars($reservation['numtel'] ?? 'N/A') . "</span>
                    </div>
                    
                    <div class='info-row'>
                        <span class='label'>Voiture :</span>
                        <span class='value'>N°" . htmlspecialchars($reservation['idvoit']) . " / Place : " . htmlspecialchars($reservation['place_num']) . "</span>
                    </div>
                    
                    <div class='info-row'>
                        <span class='label'>Frais :</span>
                        <span class='value highlight'>" . number_format($fraisTotal, 0, '.', '.') . " Ar</span>
                    </div>
                    
                    <div class='info-row'>
                        <span class='label'>Payement :</span>
                        <span class='value'>" . ucfirst(htmlspecialchars($reservation['payement'])) . "</span>
                    </div>
                    
                    <div class='info-row' style='border-bottom: none;'>
                        <span class='label'>Montant Avance :</span>
                        <span class='value highlight' style='color: #c0392b;'>" . number_format($avance, 0, '.', '.') . " Ar</span>
                        <span style='color: #777; margin-left: 15px;'>/ Reste :</span>
                        <span class='value highlight' style='color: #27ae60;'>" . number_format($reste, 0, '.', '.') . " Ar</span>
                    </div>
                </div>
            </body>
            </html>";

        $inputHtmlPath = sys_get_temp_dir() . '/receipt_' . $idreserv . '.html';
        
        file_put_contents($inputHtmlPath, $htmlContent);

        // use weasyprint
        
        $options = new \Dompdf\Options();
        $options->set('defaultFont', 'Arial');
        $options->set('isHtml5ParserEnabled', true);

        $dompdf = new \Dompdf\Dompdf($options);
        $dompdf->loadHtml($htmlContent);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        $pdfContent = $dompdf->output(); 

        // On crée une réponse Symfony standard mais vide au départ
        $response = new Response($pdfContent);
        
        // On configure explicitement les entêtes pour du binaire/fichier
        $response->headers->set('Content-Type', 'application/pdf');
        $response->headers->set('Content-Disposition', 'attachment; filename="Recu_' . $idreserv . '.pdf"');
        $response->headers->set('Content-Transfer-Encoding', 'binary');
        $response->headers->set('Pragma', 'no-cache');
        $response->headers->set('Expires', '0');


        return $response;
        } catch (\Exception $e) {
            // En cas d'erreur dans le bloc Try, on renvoie du JSON propre
            return new JsonResponse([
                "message" => "Erreur lors de la génération du PDF",
                "error" => $e->getMessage()
            ], 500);
        }
    }
}

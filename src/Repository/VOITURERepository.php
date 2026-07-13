<?php

namespace App\Repository;

use App\Entity\VOITURE;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<VOITURE>
 */
class VOITURERepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, VOITURE::class);
    }

    //    /**
    //     * @return VOITURE[] Returns an array of VOITURE objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('v')
    //            ->andWhere('v.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('v.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?VOITURE
    //    {
    //        return $this->createQueryBuilder('v')
    //            ->andWhere('v.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
    /**
 * @return VOITURE[]
 */
    public function searchByTerm(string $term): array
    {
        return $this->createQueryBuilder('v')
            ->andWhere('v.idvoit LIKE :term')
            ->setParameter('term', '%' . $term . '%')
            ->setMaxResults(10) 
            ->getQuery()
            ->getResult();
    }
}

<?php

namespace App\Repository;

use App\Entity\CLIENT;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<CLIENT>
 */
class CLIENTRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, CLIENT::class);
    }

    //    /**
    //     * @return CLIENT[] Returns an array of CLIENT objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('c')
    //            ->andWhere('c.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('c.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?CLIENT
    //    {
    //        return $this->createQueryBuilder('c')
    //            ->andWhere('c.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }

    public function findByNomNum(string $val) : array {
        return $this->createQueryBuilder('c')
        ->where("c.nom LIKE :val")
        ->orWhere('c.numtel LIKE :val')
        ->setParameter('val', '%' . $val . '%')
        ->getQuery()
        ->getResult();
    }
}

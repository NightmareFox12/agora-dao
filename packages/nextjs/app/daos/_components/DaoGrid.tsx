'use client';

import { useScaffoldReadContract } from '~~/hooks/scaffold-stark/useScaffoldReadContract';
import { Frown } from 'lucide-react';
import { IDao } from '~~/types/dao';
import React, { JSX, useMemo } from 'react';
import { DaoCard } from './DaoCard';
import { num } from 'starknet';
import { useFilterDao } from '~~/services/store/filterDao';
import { useAccount } from '~~/hooks/useAccount';

export const DaoGrid: React.FC = () => {
  const { category, name } = useFilterDao();
  const { address } = useAccount();

  //smart contract
  const { data: publicDaos, isLoading: daoLoading } = useScaffoldReadContract({
    contractName: 'AgoraDaoFabric',
    functionName: 'get_public_daos',
  });

  //memos
  const filterDaos = useMemo(() => {
    if (address === undefined) return [];

    let filterForCategory;

    switch (category) {
      case '':
        filterForCategory = publicDaos ?? [];
        break;
      case 'my-dao':
        filterForCategory =
          publicDaos?.filter(
            (x: any) =>
              num.toHex(x.creator) === num.cleanHex(address.toString())
          ) ?? [];
        break;
      default:
        filterForCategory =
          publicDaos?.filter((x: any) => x.category.toString() === category) ??
          [];
        break;
    }

    if (name !== '')
      return filterForCategory.filter((x: any) =>
        x.name.toString().toLowerCase().includes(name.toLowerCase())
      );

    return filterForCategory;
  }, [address, category, name, publicDaos]);

  //components
  const LoadingCards = (): JSX.Element => {
    return (
      <article className='w-full grid gap-6 sm:grid-cols-2 md:grid-cols-3 px-4 sm:mt-4 mb-2 sm:mb-4'>
        {Array(9)
          .fill(0)
          .map((_x, y) => (
            <div key={y} className='skeleton bg-primary h-56 w-full' />
          ))}
      </article>
    );
  };

  return (
    <section>
      {daoLoading ? (
        <LoadingCards />
      ) : filterDaos.length === 0 ? (
        <article className='h-96 mt-5 flex justify-center flex-col text-center py-12'>
          <Frown className='h-20 w-20 text-muted-foreground mx-auto mb-4' />
          <h3 className='text-2xl font-semibold mb-2'>No DAOs are available</h3>
          <p className='text-muted-foreground'>
            Please check back later to see new organizations available.
          </p>
        </article>
      ) : (
        <article className='container px-2 sm:px-2 md:max-w-6xl mx-auto py-8'>
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {filterDaos.map((dao) => {
              const x = dao as unknown as IDao;

              if (address === undefined) return;
              return (
                <DaoCard
                  key={x.dao_ID}
                  daoID={x.dao_ID}
                  daoAddress={num.toHex(x.dao_address)}
                  creatorAddress={num.toHex(x.creator)}
                  userAddress={num.cleanHex(address.toString())}
                  name={x.name}
                  description={x.description}
                  category={x.category}
                  imageUri={x.image_URI}
                  creationDate={x.creation_timestamp}
                />
              );
            })}
          </div>
        </article>
      )}
    </section>
  );
};

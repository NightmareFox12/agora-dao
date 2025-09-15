'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Funnel, Search } from 'lucide-react';
import { useAccount } from '~~/hooks/useAccount';
import { useScaffoldReadContract } from '~~/hooks/scaffold-stark/useScaffoldReadContract';
import { useFilterDao } from '~~/services/store/filterDao';
import { useHeaderState } from '~~/services/store/header';

export const HeaderDaoList: React.FC = () => {
  const { isConnected } = useAccount();
  const router = useRouter();

  //Global states
  const { setShowHeader } = useHeaderState();
  const { category, setCategory, name, setName } = useFilterDao();

  //smart contract
  const { data: allCategories, isLoading: daoCategoriesLoading } =
    useScaffoldReadContract({
      contractName: 'AgoraDaoFabric',
      functionName: 'get_all_categories',
    });

  //effects
  useEffect(() => {
    if (isConnected) setShowHeader(false);
    else router.replace('/');
  }, [isConnected, router, setShowHeader]);

  return (
    <header className='border-b bg-base-100 border-secondary'>
      <div className='xl:container mx-auto px-6 py-1'>
        <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
          <div>
            <h1 className='text-3xl text-center md:text-left font-bold text-balance'>
              Available DAOs
            </h1>
            <p className='text-center md:text-left text-muted-foreground mt-2 '>
              Discover and join decentralized autonomous organizations
            </p>
          </div>
          <div className='flex gap-4 mb-2 justify-center md:mb-0 md:justify-start'>
            <div className='relative w-full md:max-w-sm'>
              <div className='input bg-input text-accent flex items-center border-disabled bg-base-300 focus-within:border-none'>
                <button className='btn btn-accent btn-sm btn-circle -ml-2'>
                  <Search className='h-4 w-4' />
                </button>
                <input
                  type='search'
                  autoComplete='off'
                  autoCapitalize='sentences'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder='Search for a DAO'
                  className='input input-ghost focus-within:border-transparent focus:outline-hidden focus:bg-transparent h-[2.2rem] min-h-[2.2rem] px-4 border w-full text-xs placeholder:text-[#9596BF] text-neutral rounded-none'
                />
              </div>
            </div>

            {/* Filter  */}
            {daoCategoriesLoading || allCategories === undefined ? (
              <div className='h-10 w-12 skeleton bg-base-200' />
            ) : (
              <div className='dropdown dropdown-end'>
                <div tabIndex={0} role='button' className='btn btn-accent'>
                  {category !== '' && (
                    <span className='bg-base-100 px-2 py-0.5 flex justify-center items-center rounded-lg font-bold text-[10px]'>
                      1
                    </span>
                  )}
                  <Funnel className='h-4 w-4 text-accent-content' />
                </div>
                <ul
                  tabIndex={0}
                  className='dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm'
                >
                  <li
                    onClick={() => setCategory('')}
                    className={`${category === '' ? 'bg-accent' : ''}`}
                  >
                    <p className='m-0.5'>All</p>
                  </li>
                  <li
                    onClick={() => setCategory('my-dao')}
                    className={`${category === 'my-dao' ? 'bg-accent' : ''}`}
                  >
                    <p className='m-0.5'>My DAOs</p>
                  </li>
                  {allCategories.map((x, y) => (
                    <li
                      key={y}
                      onClick={() => setCategory(x.toString())}
                      className={`${category === x.toString() ? 'bg-accent' : ''}`}
                    >
                      <p className='m-0.5'>{x.toString()}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

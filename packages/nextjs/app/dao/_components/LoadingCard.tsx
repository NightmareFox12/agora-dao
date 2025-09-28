import React from 'react';

type LoadingCardsProps = {
  amount?: number;
};

export const LoadingCards: React.FC<LoadingCardsProps> = ({ amount = 9 }) => {
  const arr = new Array(amount).fill(0);

  return arr.map((_, y) => (
    <div key={y + '-loading'} className='flex justify-center items-center'>
      <div className='h-56 w-[300px] max-w-[400px] skeleton bg-primary' />
    </div>
  ));
};

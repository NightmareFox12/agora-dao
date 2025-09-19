'use client';

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Rocket } from 'lucide-react';
import { useAccount } from '~~/hooks/useAccount';
import { CustomConnectButton } from '~~/components/scaffold-stark/CustomConnectButton';
import DecryptedText from '~~/components/ui/DecryptedText';
import RotatingText from '~~/components/ui/RotatingText';

export const HeroSection: React.FC = () => {
  const { isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (isConnected) router.push('/daos');
  }, [isConnected, router]);

  return (
    <section className='py-20 px-4 relative z-10'>
      <div className='container mx-auto text-center max-w-4xl'>
        <div className='badge badge-secondary border-base-200 py-3 mb-6'>
          <Rocket className='w-4 h-4' />
          <DecryptedText
            text='Decentralization in Action'
            animateOn='view'
            speed={100}
            maxIterations={15}
            revealDirection='center'
          />
        </div>
        <h1 className='text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance'>
          <div className='flex justify-center'>
            The platform for DAOs that work seriously
          </div>
        </h1>
        <RotatingText
          texts={[
            'Vote',
            'Participate',
            'Earn',
            'Organize',
            'Clear tasks',
            'Collective decisions',
          ]}
          mainClassName='text-4xl md:text-6xl font-bold px-2 sm:px-2 md:px-3 overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg'
          staggerFrom={'last'}
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '-120%' }}
          staggerDuration={0.025}
          splitLevelClassName='overflow-hidden pb-0.5 sm:pb-1 md:pb-1'
          elementLevelClassName='text-secondary'
          transition={{ type: 'keyframes', damping: 30, stiffness: 400 }}
          rotationInterval={2000}
        />
        <p className='text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto'>
          AgoraDAO is the decentralized platform where your voice matters.
          Participate in important decisions, complete tasks, and receive
          rewards for contributing to the ecosystem.
        </p>

        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <CustomConnectButton />
        </div>
      </div>
    </section>
  );
};

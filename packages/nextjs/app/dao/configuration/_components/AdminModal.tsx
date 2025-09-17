'use client';

import { ArrowLeft } from 'lucide-react';
import { useScaffoldReadContract } from '~~/hooks/scaffold-stark/useScaffoldReadContract';
import { useAccount } from '~~/hooks/useAccount';
import { useDaoState } from '~~/services/store/dao';

export const ModalAdmin: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { daoAddress } = useDaoState();

  //Smart contract
  const { data: is_user, isLoading: is_user_loading } = useScaffoldReadContract(
    {
      contractName: 'AgoraDao',
      functionName: 'is_user',
      args: [address],
      contractAddress: daoAddress,
    }
  );

  return (
    !isConnected ||
    is_user_loading ||
    is_user === undefined ||
    (is_user && (
      <>
        <input type='checkbox' className='modal-toggle' checked readOnly />
        <div className='modal' role='dialog'>
          <div className='modal-box modal-middle !min-h-10'>
            <h3 className='text-lg font-bold'>⚠️ Attention!</h3>

            <p className='py-2 text-center'>
              You are accessing a section reserved for administrative tasks.
            </p>

            <div className='modal-action justify-center'>
              <button className='btn btn-accent'>
                <ArrowLeft className='w-4 h-4' />
                Back
              </button>
            </div>
          </div>
        </div>
      </>
    ))
  );
};

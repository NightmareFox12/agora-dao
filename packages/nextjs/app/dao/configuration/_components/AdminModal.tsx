'use client';

import { useScaffoldReadContract } from '~~/hooks/scaffold-stark/useScaffoldReadContract';
import { useAccount } from '~~/hooks/useAccount';

export const ModalAdmin: React.FC = () => {
  const { isConnected } = useAccount();

  //Smart contract
  const { data: is_user, isLoading: is_user_loading } = useScaffoldReadContract(
    {
      contractName: 'AgoraDao',
      functionName: 'is_user',
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
          <div className='modal-box'>
            <h3 className='text-lg font-bold'>¡Hola!</h3>
            <p className='py-4'>
              Este modal está abierto por defecto y no se puede cerrar.
            </p>
          </div>
        </div>
      </>
    ))
  );
};

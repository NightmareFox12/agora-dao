'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useScaffoldReadContract } from '~~/hooks/scaffold-stark/useScaffoldReadContract';
import { useAccount } from '~~/hooks/useAccount';
import { useDaoState } from '~~/services/store/dao';

export const AdminModal: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { daoAddress } = useDaoState();
  const router = useRouter();

  //Smart contract
  const { data: isAdmin } = useScaffoldReadContract({
    contractName: 'AgoraDao',
    functionName: 'is_admin_role',
    args: [address],
    contractAddress: daoAddress,
    watch: false,
  });

  const { data: isManagerRole } = useScaffoldReadContract({
    contractName: 'AgoraDao',
    functionName: 'is_manager_role',
    args: [address],
    contractAddress: daoAddress,
    watch: false,
  });

  //memos
  const parsedAdmin = useMemo(() => {
    return isAdmin as any as boolean | undefined;
  }, [isAdmin]);

  const parsedManagerRole = useMemo(() => {
    return isManagerRole as any as boolean | undefined;
  }, [isManagerRole]);

  const showModal =
    !isConnected ||
    (parsedAdmin === undefined && parsedManagerRole === undefined) ||
    !parsedAdmin ||
    !parsedManagerRole;

  return (
    showModal && (
      <dialog open onClose={(e) => e.preventDefault()} className='modal'>
        <div className='modal-box modal-middle !min-h-10'>
          <h3 className='text-lg font-bold'>⚠️ Attention!</h3>

          <p className='py-2 text-center'>
            You are accessing a section reserved for administrative tasks.
          </p>

          <div className='modal-action justify-center'>
            <button onClick={() => router.back()} className='btn btn-accent'>
              <ArrowLeft className='w-4 h-4' />
              Back
            </button>
          </div>
        </div>
      </dialog>
    )
  );
};

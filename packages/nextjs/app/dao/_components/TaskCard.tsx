import { formatEther } from 'ethers';
import { Check, Info } from 'lucide-react';
import React from 'react';
import { num } from 'starknet';
import { Address } from '~~/components/scaffold-stark/Address';
import { useScaffoldReadContract } from '~~/hooks/scaffold-stark/useScaffoldReadContract';
import { useScaffoldWriteContract } from '~~/hooks/scaffold-stark/useScaffoldWriteContract';
import { useAccount } from '~~/hooks/useAccount';
import { ITask } from '~~/types/task';

type TaskCardProps = {
  task: ITask;
  daoAddress: string;
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, daoAddress }) => {
  const { address: userAddress } = useAccount();

  //parsed data
  const parsedCreatorAddress = num.toHex(task.creator);
  const parsedUserAddress = num.cleanHex(userAddress as string);
  const status = task.status.activeVariant();
  const parsedDate = new Date(Number(task.deadline) * 1000)
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, '/');

  //Smart contract
  const { sendAsync } = useScaffoldWriteContract({
    contractName: 'AgoraDao',
    functionName: 'accepted_task',
    args: [task.task_id],
    contractAddress: daoAddress,
  });

  const { data: totalCounter } = useScaffoldReadContract({
    contractName: 'AgoraDao',
    functionName: 'auditor_role_counter',
    args: ['0xd8da6bf26964af9d7eed9e03e53415d37aa9604'],
    contractAddress: daoAddress,
  });

  //functions
  const showModal = () => {
    const modal = document.getElementById('modal_info') as HTMLDialogElement;
    modal.showModal();
  };

  const handleAcceptTask = async () => {
    try {
      await sendAsync();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {/* Modal */}
      <dialog id='modal_info' className='modal'>
        <div className='modal-box'>
          <h3 className='font-bold text-lg'>{task.title}</h3>
          <p className='py-1'>{task.description}</p>

          <div>
            <p className='my-1'>Reward: {formatEther(task.reward)} STRK</p>
            <p className='my-1'>Deadline: {parsedDate}</p>
            <p className='my-1'>Creator:</p>
            <Address address={parsedCreatorAddress as `0x${string}`} />
          </div>

          <div className='flex justify-center mt-5'>
            <button
              onClick={handleAcceptTask}
              disabled={parsedCreatorAddress === parsedUserAddress}
              className='btn btn-accent btn-sm'
            >
              <Check className='w-4 h-4' />
              Accept task
            </button>
          </div>
        </div>
        <form method='dialog' className='modal-backdrop'>
          <button>Close</button>
        </form>
      </dialog>

      {/* Card */}
      <article className='card bg-base-200 shadow-sm border border-gradient'>
        <div className='card-body'>
          <h2 className='card-title break-all'>{task.title}</h2>
          <div className='badge badge-warning badge-sm'>{status}</div>
          <p className='my-1 break-all line-clamp-3'>{task.description}</p>
          <Address address={parsedCreatorAddress as `0x${string}`} />
          <p className='my-0 font-bold'>{formatEther(task.reward)} STRK</p>
          <div className='card-actions justify-center'>
            <button onClick={showModal} className='btn btn-accent'>
              <Info className='w-4 h-4' />
              Info
            </button>
          </div>
        </div>
      </article>
    </>
  );
};

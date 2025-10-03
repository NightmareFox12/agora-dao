import { formatEther } from 'ethers';
import { Check, Info } from 'lucide-react';
import React, { useState } from 'react';
import { num } from 'starknet';
import { Address } from '~~/components/scaffold-stark/Address';
import { useScaffoldWriteContract } from '~~/hooks/scaffold-stark/useScaffoldWriteContract';
import { ITask } from '~~/types/task';

const difficultyColors = {
  ['TRIVIAL']: 'bg-blue-200 text-blue-800 border-blue-200',
  ['LOW']: 'bg-blue-100 text-blue-800 border-blue-200',
  ['MEDIUM']: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  ['HIGH']: 'bg-orange-100 text-orange-800 border-orange-200',
  ['CRITICAL']: 'bg-red-100 text-red-800 border-red-200',
};

//Components
type TaskInfoDialogProps = {
  task: ITask;
  parsedDate: string;
  parsedCreatorAddress: `0x${string}`;
  parsedUserAddress: string;
  handleAcceptTask: () => Promise<void>;
};

const TaskInfoDialog: React.FC<TaskInfoDialogProps> = ({
  task,
  parsedDate,
  parsedCreatorAddress,
  parsedUserAddress,
  handleAcceptTask,
}) => (
  <dialog id={`modal_info_${task.task_id}`} className='modal'>
    <div className='modal-box'>
      <h3 className='font-bold text-lg whitespace-pre-wrap break-words overflow-y-auto'>
        {task.title}
      </h3>
      <p className='py-1 whitespace-pre-wrap break-words overflow-y-auto max-h-60'>
        {task.description}
      </p>

      <div>
        <p className='my-1'>Reward: {formatEther(task.reward)} STRK</p>
        <p className='my-1'>Deadline: {parsedDate}</p>
        <p className='my-1'>Creator:</p>
        <Address address={parsedCreatorAddress} />
      </div>

      <div className='flex justify-center mt-5'>
        <button
          onClick={handleAcceptTask}
          disabled={
            parsedCreatorAddress === parsedUserAddress ||
            task.status.activeVariant() !== 'OPEN'
          }
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
);

const TaskAcceptedDialog: React.FC<TaskInfoDialogProps> = ({
  task,
  parsedDate,
  parsedCreatorAddress,
}) => {
  const acceptedAddress = task.accepted_by.unwrap();

  return (
    <dialog id={`modal_accepted_${task.task_id}`} className='modal'>
      <div className='modal-box'>
        <h3 className='font-bold text-lg whitespace-pre-wrap break-words overflow-y-auto'>
          {task.title}
        </h3>
        <p className='py-1 whitespace-pre-wrap break-words overflow-y-auto max-h-60'>
          {task.description}
        </p>
        <div>
          <p className='my-1'>Reward: {formatEther(task.reward)} STRK</p>
          <p className='my-1'>Deadline: {parsedDate}</p>
          <p className='my-1'>Creator:</p>
          <Address address={parsedCreatorAddress} />
          {acceptedAddress !== undefined && (
            <>
              <p className='my-1'>Accepted By:</p>
              <Address
                address={num.toHex(acceptedAddress.toString()) as `0x${string}`}
              />
            </>
          )}
        </div>
      </div>
      <form method='dialog' className='modal-backdrop'>
        <button>Close</button>
      </form>
    </dialog>
  );
};

//TODO: aqui hacer lo del form de la URL para entregar la tarea y luego marcar la tarea para que sea verifica por el creador y un auditor para pagarle al user
const FinishTaskDialog: React.FC<TaskInfoDialogProps> = ({
  task,
  parsedDate,
  parsedCreatorAddress,
  parsedUserAddress,
  handleAcceptTask,
}) => {
  const [submissionUrl, setSubmissionUrl] = useState<string>('');

  return (
    <dialog id={`modal_finish_${task.task_id}`} className='modal'>
      <div className='modal-box'>
        <h3 className='font-bold text-lg whitespace-pre-wrap break-words overflow-y-auto'>
          {task.title}
        </h3>
        <p className='py-1 whitespace-pre-wrap break-words overflow-y-auto max-h-60'>
          {task.description}
        </p>
        <div>
          <p className='my-1'>Reward: {formatEther(task.reward)} STRK</p>
          <p className='my-1'>Deadline: {parsedDate}</p>
          <p className='my-1'>Creator:</p>
          <Address address={parsedCreatorAddress} />
        </div>
      </div>
      <form method='dialog' className='modal-backdrop'>
        <button>Close</button>
      </form>
    </dialog>
  );
};

type TaskCardProps = {
  task: ITask;
  type: 'created' | 'accepted' | 'completed' | 'available';
  userAddress: string;
  daoAddress: string;
};

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  userAddress,
  daoAddress,
  type,
}) => {
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

  //functions
  const showModal = (id: string) => {
    const modal = document.getElementById(id) as HTMLDialogElement;

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
      {type === 'available' && (
        <TaskInfoDialog
          task={task}
          parsedDate={parsedDate}
          parsedCreatorAddress={parsedCreatorAddress as `0x${string}`}
          parsedUserAddress={parsedUserAddress}
          handleAcceptTask={handleAcceptTask}
        />
      )}

      {/* Card */}
      <article className='card bg-base-200 shadow-sm border border-gradient'>
        <div className='card-body'>
          <div className='flex justify-between'>
            <h2 className='card-title break-all'>{task.title}</h2>
            <span
              className={`badge badge-warning badge-sm ${difficultyColors[task.difficulty]}`}
            >
              {task.difficulty}
            </span>
          </div>

          <span className='badge badge-warning badge-sm'>{status}</span>
          <p className='my-1 break-all line-clamp-3'>{task.description}</p>

          <p className='text-sm my-0'>Create by:</p>
          <Address address={parsedCreatorAddress as `0x${string}`} />
          <p className='my-0 font-bold'>{formatEther(task.reward)} STRK</p>

          <div className='card-actions justify-center'>
            {type === 'available' && (
              <button
                onClick={() => showModal(`modal_info_${task.task_id}`)}
                className='btn btn-accent'
              >
                <Info className='w-4 h-4' />
                Info
              </button>
            )}

            {type === 'accepted' && (
              <>
                {/* Modals */}
                <TaskAcceptedDialog
                  task={task}
                  parsedDate={parsedDate}
                  parsedCreatorAddress={parsedCreatorAddress as `0x${string}`}
                  parsedUserAddress={parsedUserAddress}
                  handleAcceptTask={handleAcceptTask}
                />

                <FinishTaskDialog
                  task={task}
                  parsedDate={parsedDate}
                  parsedCreatorAddress={parsedCreatorAddress as `0x${string}`}
                  parsedUserAddress={parsedUserAddress}
                  handleAcceptTask={handleAcceptTask}
                />

                <button
                  onClick={() => showModal(`modal_accepted_${task.task_id}`)}
                  className='btn btn-accent'
                >
                  <Info className='w-4 h-4' />
                  Info
                </button>

                <button
                  onClick={() => showModal(`modal_finish_${task.task_id}`)}
                  className='btn btn-success'
                >
                  <Check className='w-4 h-4' />
                  Finish Task
                </button>
              </>
            )}
          </div>
        </div>
      </article>
    </>
  );
};

import { Image, Info, X } from 'lucide-react';
import { useMemo, useRef } from 'react';
import { Address } from '~~/components/scaffold-stark';
import { useScaffoldEventHistory } from '~~/hooks/scaffold-stark/useScaffoldEventHistory';
import { UserJoinedEvent } from '~~/types/events.types';

type DaoDetailsDialogProps = {
  daoID: bigint;
  daoAddress: string;
  name: string;
  description: string;
  imageUri: string;
  creationDate: bigint;
};

export const DaoDetailsDialog: React.FC<DaoDetailsDialogProps> = ({
  daoID,
  daoAddress,
  name,
  description,
  imageUri,
  creationDate,
}) => {
  //refs
  const dialogRef = useRef<HTMLDialogElement>(null);

  //const
  const parsedDate = new Date(parseInt((creationDate * 1000n).toString()))
    .toISOString()
    .split('T')[0]
    .replace(/-/g, '/');

  //Smart contract
  const { data: userJoined, isLoading: isLoadingEvents } =
    useScaffoldEventHistory({
      contractName: 'AgoraDao',
      eventName: 'UserJoined',
      contractAddress: daoAddress,
      fromBlock: 0n,
      watch: true,
      blockData: true,
      transactionData: true,
      receiptData: true,
    });

  //TODO: agregar tabla de eventos con un tab para (unidos,votaciones o mas cosas)

  //memos
  const userJoinedArr = useMemo(() => {
    if (!userJoined || userJoined.length === 0 || isLoadingEvents) return [];

    const data: UserJoinedEvent[] = [];
    userJoined.map((x) => data.push(x as unknown as UserJoinedEvent));

    return data;
  }, [isLoadingEvents, userJoined]);

  return (
    <>
      <button
        onClick={() => dialogRef.current?.showModal()}
        className='btn btn-accent p-3'
      >
        <Info className='w-4 h-4' />
      </button>
      <dialog ref={dialogRef} className='modal'>
        <div className='modal-box sm:!max-w-2xl'>
          <div className='flex justify-end'>
            <button
              onClick={() => dialogRef.current?.close()}
              className='btn btn-ghost btn-sm btn-circle'
            >
              <X className='w-4 h-4' />
            </button>
          </div>
          <h3 className='font-bold text-lg'>{name} Details</h3>
          <p>{description}</p>
          <div className='flex justify-between'>
            <span className='text-sm text-base-content/70'>
              Created on: <span className='font-semibold'>{parsedDate}</span>
            </span>
            <div className='badge badge-neutral font-semibold text-[12px]'>
              ID #{daoID}
            </div>
          </div>

          {/* image */}
          <div className='flex flex-col items-center justify-center mt-2'>
            {imageUri.length > 4 ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`https://ipfs.io/ipfs/${imageUri}`}
                alt={name}
                className='object-cover w-32 h-32 rounded-2xl'
              />
            ) : (
              // eslint-disable-next-line jsx-a11y/alt-text
              <Image className='w-12 h-12' />
            )}
            <span className='text-sm font-semibold text-primary-content/80'>
              Logo
            </span>
          </div>

          {isLoadingEvents ? (
            <div className='skeleton w-full h-20 bg-primary my-2' />
          ) : userJoinedArr.length === 0 ? (
            <div className=''>
              <p className='text-center font-semibold'>
                No users yet to display
              </p>
            </div>
          ) : (
            <div className='overflow-x-auto mt-3 rounded-lg'>
              <table className='table'>
                <thead className='bg-accent text-accent-content'>
                  <tr>
                    <th>ID</th>
                    <th>BlockHash</th>
                    <th>User</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {userJoinedArr.slice(0, 4).map((x, y) => {
                    const parsedDate = new Date(
                      parseInt((x.block.timestamp * 1000).toString())
                    )
                      .toISOString()
                      .split('T')[0]
                      .replace(/-/g, '/');

                    return (
                      <tr key={y} className='bg-base-200'>
                        <th>{y + 1}</th>
                        <td>
                          <a
                            href={`https://starkscan.co/block/${x.block.block_hash}`}
                            target='_blank'
                            rel='noreferrer'
                            className='link whitespace-nowrap'
                          >
                            View on Block Explorer
                          </a>
                        </td>
                        <td>
                          <Address address={x.parsedArgs.user} />
                        </td>
                        <td>{parsedDate}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </dialog>
    </>
  );
};
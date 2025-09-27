import { useMemo } from 'react';
import { hash, num, shortString } from 'starknet';
import { Address } from '~~/components/scaffold-stark';
import { useScaffoldEventHistory } from '~~/hooks/scaffold-stark/useScaffoldEventHistory';
import { RoleCreatedEvent } from '~~/types/events.types';

const roleMap = {
  [hash.getSelectorFromName('ADMIN_ROLE')]: 'ADMIN_ROLE',
  [hash.getSelectorFromName('ROLE_MANAGER_ROLE')]: 'ROLE_MANAGER_ROLE',
  [hash.getSelectorFromName('AUDITOR_ROLE')]: 'AUDITOR_ROLE',
  [hash.getSelectorFromName('TASK_CREATOR_ROLE')]: 'TASK_CREATOR_ROLE',
  [hash.getSelectorFromName('PROPOSAL_CREATOR_ROLE')]: 'PROPOSAL_CREATOR_ROLE',
  [hash.getSelectorFromName('USER_ROLE')]: 'USER_ROLE',
};

type LastChangesDialogProps = {
  daoAddress: string;
};

export const LastChangesDialog: React.FC<LastChangesDialogProps> = ({
  daoAddress,
}) => {
  const { data, isLoading } = useScaffoldEventHistory({
    contractName: 'AgoraDao',
    eventName: 'RoleCreated',
    contractAddress: daoAddress,
    fromBlock: BigInt(0),
    // filters: { parameterName: value },
    blockData: true,
    transactionData: false,
    receiptData: false,
    watch: true,
    enabled: true,
  });

  //memo
  const parsedEvent = useMemo(() => {
    if (!data || data.length === 0) return [];

    const res = data as any as RoleCreatedEvent[];

    return res;
  }, [data]);

  return (
    <dialog id='last_changes' className='modal'>
      <div className='modal-box !w-11/12 !max-w-5xl'>
        <h3 className='font-bold text-lg'>Check the last changes</h3>
        <p className='py-4'>Press ESC key or click outside to close</p>

        <div className='overflow-x-auto'>
          <table className='table table-zebra'>
            {/* head */}
            <thead>
              <tr>
                <th></th>
                <th>Role</th>
                <th>Assigned By</th>
                <th>Assigned To</th>
              </tr>
            </thead>
            <tbody>
              {parsedEvent.map((x, y) => {
                const decodedName = roleMap[num.toHex(x.parsedArgs.role_name)];

                return (
                  <tr key={y}>
                    {/* <th>{x.parsedArgs.role_ID}</th> */}
                    <th>{y}</th>
                    <td>
                      <span className='badge badge-accent badge-sm'>
                        {decodedName}
                      </span>
                    </td>
                    <td>
                      <Address
                        address={
                          num.cleanHex(
                            x.parsedArgs.assigned_by
                          ) as `0x${string}`
                        }
                      />
                    </td>
                    <td>
                      <Address
                        address={
                          num.cleanHex(
                            x.parsedArgs.assigned_to
                          ) as `0x${string}`
                        }
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <form method='dialog' className='modal-backdrop'>
        <button>close</button>
      </form>
    </dialog>
  );
};

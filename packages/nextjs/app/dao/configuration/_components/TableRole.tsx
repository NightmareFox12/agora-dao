'use client';

import React from 'react';
import { num } from 'starknet';
import { Address } from '~~/components/scaffold-stark';
import { useScaffoldReadContract } from '~~/hooks/scaffold-stark/useScaffoldReadContract';

const useTableData = (
  role: string,
  daoAddress: string,
  address: `0x${string}` | undefined
) => {
  const { data: allManager } = useScaffoldReadContract({
    contractName: 'AgoraDao',
    functionName: 'get_all_manager_role',
    args: [address],
    contractAddress: daoAddress,
  });

  const { data: allAuditor } = useScaffoldReadContract({
    contractName: 'AgoraDao',
    functionName: 'get_all_auditor_role',
    args: [address],
    contractAddress: daoAddress,
    watch: false,
  });

  const { data: allTaskCreator } = useScaffoldReadContract({
    contractName: 'AgoraDao',
    functionName: 'get_all_task_creator_role',
    args: [address],
    contractAddress: daoAddress,
    watch: false,
  });

  const { data: AllProposalCreator } = useScaffoldReadContract({
    contractName: 'AgoraDao',
    functionName: 'get_all_proposal_creator_role',
    args: [address],
    contractAddress: daoAddress,
    watch: false,
  });

  const { data: AllUser } = useScaffoldReadContract({
    contractName: 'AgoraDao',
    functionName: 'get_all_user_role',
    args: [address],
    contractAddress: daoAddress,
    watch: false,
  });

  switch (role) {
    case 'Role Manager':
      return allManager;
    case 'Auditor':
      return allAuditor;
    case 'Task Creator':
      return allTaskCreator;
    case 'Propossal Creator':
      return AllProposalCreator;
    case 'User':
      return AllUser;
    default:
      return [];
  }
};

type TableRoleProps = {
  role: string;
  daoAddress: string;
  address: `0x${string}`;
};

export const TableRole: React.FC<TableRoleProps> = ({
  role,
  daoAddress,
  address,
}) => {
  const tableData = useTableData(role, daoAddress, address);

  return (
    <div className='overflow-x-auto flex justify-center'>
      <table className='table bg-primary sm:w-7/12'>
        {/* head */}
        <thead>
          <tr>
            <th>
              {/* <label>
                <input type='checkbox' className='checkbox' />
              </label> */}
            </th>
            <th className='text-center'>Address</th>
          </tr>
        </thead>
        <tbody>
          {tableData?.map((x, y) => {
            const address_x = x as unknown as bigint;
            const parsedAddress = num.toHex(address_x);

            return (
              <tr key={y}>
                <th>
                  {/* <label>
                    <input type='checkbox' className='checkbox' />
                  </label> */}
                  {y + 1}
                </th>

                <td className='flex justify-center'>
                  <Address address={parsedAddress as `0x${string}`} />
                </td>

                {/* {parsedAddress !== num.cleanHex(address) && (
                  <th>
                    <button className='btn btn-accent btn-sm'>
                      <Minus className='w-4 h-4' />
                    </button>
                  </th>
                )} */}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

'use client';

import { Minus } from 'lucide-react';
import React from 'react';
import { num } from 'starknet';
import { Address } from '~~/components/scaffold-stark';
import { useScaffoldReadContract } from '~~/hooks/scaffold-stark/useScaffoldReadContract';

const GetAdminData = (
  daoAddress: string,
  address: `0x${string}` | undefined
) => {
  const { data: adminData } = useScaffoldReadContract({
    contractName: 'AgoraDao',
    functionName: 'get_all_admin_role',
    contractAddress: daoAddress,
    args: [address],
    watch: false,
  });

  return adminData;
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
  const adminData = GetAdminData(daoAddress, address);

  return (
    <div className='overflow-x-auto'>
      <table className='table bg-primary'>
        {/* head */}
        <thead>
          <tr>
            <th>
              <label>
                <input type='checkbox' className='checkbox' />
              </label>
            </th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {adminData?.map((x, y) => {
            const address_x = x as unknown as bigint;
            const parsedAddress = num.toHex(address_x);

            return (
              <tr key={y}>
                <th>
                  <label>
                    <input type='checkbox' className='checkbox' />
                  </label>
                </th>
                <td>
                  <Address address={parsedAddress as `0x${string}`} />
                </td>

                {parsedAddress !== num.cleanHex(address) && (
                  <th>
                    <button className='btn btn-accent btn-sm'>
                      <Minus className='w-4 h-4' />
                    </button>
                  </th>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

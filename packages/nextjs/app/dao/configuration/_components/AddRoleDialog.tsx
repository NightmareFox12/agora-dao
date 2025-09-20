'use client';

import React, { useState } from 'react';
import { AddressInput } from '~~/components/scaffold-stark';

type AddRoleDialogProps = {
  role: string;
  daoAddress: string;
  address: `0x${string}`;
};

export const AddRoleDialog: React.FC<AddRoleDialogProps> = ({
  role,
  daoAddress,
  address,
}) => {
  //states
  const [newRoleAddress, setNewRoleAddress] = useState<string>('');

  return (
    <>
      <button
        className='btn btn-primary'
        onClick={() => {
          const dialog = document.getElementById(
            'create_role'
          ) as HTMLDialogElement;
          dialog.showModal();
        }}
      >
        Create {role}
      </button>
      
      {/* Modal */}
      <dialog id='create_role' className='modal'>
        <div className='modal-box'>
          <form method='dialog'>
            <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>
              ✕
            </button>
          </form>
          <h3 className='font-bold text-lg'>Hello!</h3>
          <p className='py-4'>Press ESC key or click on ✕ button to close</p>

          <AddressInput
            onChange={setNewRoleAddress}
            value={newRoleAddress}
            placeholder='Input your address'
          />

          <div className='modal-action' />
        </div>
      </dialog>
    </>
  );
};

'use client';

import { Minus, Plus, UserRoundPen, X } from 'lucide-react';
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
  const [addressInputs, setAddressInputs] = useState<string[]>(['']);

  //functions
  const handlePlusClick = () => {
    setAddressInputs([...addressInputs, '']);
  };

  const handleMinusClick = (index: number) => {
    const newAddresses = [...addressInputs];
    if (newAddresses.length === 1) return;
    newAddresses.splice(index, 1);
    setAddressInputs(newAddresses);
  };

  const handleAddressChange = (index: number, value: string) => {
    const newAddresses = [...addressInputs];
    newAddresses[index] = value;
    setAddressInputs(newAddresses);
  };

  return (
    <>
      <div className='w-full flex justify-center'>
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
      </div>

      {/* Modal */}
      <dialog id='create_role' className='modal'>
        <div className='modal-box !overflow-y-auto !h-96'>
          <form method='dialog'>
            <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>
              <X className='w-4 h-4' />
            </button>
          </form>
          <h3 className='font-bold text-lg'>Create {role}!</h3>
          <p className='py-4'>
            Enter one or more addresses to which you want to assign the{' '}
            <b>{role}</b> role within the DAO.
          </p>

          <article className='flex flex-col gap-3'>
            {addressInputs.map((address, index) => (
              <div key={index} className='flex w-full gap-2 items-center'>
                <button
                  onClick={() => handleMinusClick(index)}
                  disabled={addressInputs.length === 1}
                  className='btn btn-accent btn-circle btn-sm'
                >
                  <Minus className='w-4 h-4' />
                </button>
                <div className='flex-1'>
                  <AddressInput
                    onChange={(value) => handleAddressChange(index, value)}
                    value={address}
                    placeholder='Input your address'
                  />
                </div>
              </div>
            ))}
          </article>

          {/* Actions */}
          <div className='flex justify-center items-center mt-10 gap-4'>
            <div className='tooltip tooltip-top' data-tip='Add new Input'>
              <button
                className='btn btn-accent btn-circle'
                onClick={handlePlusClick}
              >
                <Plus className='w-4 h-4' />
              </button>
            </div>
            <button
              disabled={addressInputs.every((addr) => addr.trim() !== '')}
              className='btn btn-accent'
            >
              <UserRoundPen className='w-4 h-4' />
              {addressInputs.length > 1 ? 'Create Roles' : 'Create Rol'}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

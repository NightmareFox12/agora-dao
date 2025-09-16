'use client';

import { useEffect, useState } from 'react';
import { useHeaderState } from '~~/services/store/header';
import { TaskFAB } from './TaskFAB';
import { CreateTaskDialog } from './CreateTaskDialog';
import { LOCAL_STORAGE_KEYS } from '~~/utils/storage_keys';
import { useRouter } from 'next/navigation';
import { useTaskState } from '~~/services/store/task';

export const TaskClientController: React.FC = () => {
  const router = useRouter();
  const { setShowHeader } = useHeaderState();
  const { daoAddress, setDaoAddress } = useTaskState();

  //States
  const [showCreateTaskDialog, setShowCreateTaskDialog] =
    useState<boolean>(false);

  //effects
  useEffect(() => {
    setShowHeader(true);
  }, [setShowHeader]);

  useEffect(() => {
    const address = localStorage.getItem(LOCAL_STORAGE_KEYS.DAO_ADDRESS);
    if (address !== null) setDaoAddress(address);
    else router.replace('/daos');
  }, [router, setDaoAddress]);

  return (
    <>
      {showCreateTaskDialog && (
        <CreateTaskDialog
          daoAddress={daoAddress}
          setShowCreateTaskDialog={setShowCreateTaskDialog}
        />
      )}

      <TaskFAB setShowCreateTaskDialog={setShowCreateTaskDialog} />
    </>
  );
};
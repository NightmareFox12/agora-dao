'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useDaoState } from '~~/services/store/dao';
import { useHeaderState } from '~~/services/store/header';
import { LOCAL_STORAGE_KEYS } from '~~/utils/storage_keys';
import { AdminModal } from './AdminModal';

export const ConfigurationClientController: React.FC = () => {
  const router = useRouter();

  //global states
  const { showHeader, setShowHeader } = useHeaderState();
  const { daoAddress, setDaoAddress } = useDaoState();

  useEffect(() => {
    if (!showHeader) setShowHeader(true);
    const dao = localStorage.getItem(LOCAL_STORAGE_KEYS.DAO_ADDRESS);
    if (dao === null) return router.replace('/daos');

    setDaoAddress(dao);
  }, [daoAddress.length, router, setDaoAddress, setShowHeader, showHeader]);

  return <AdminModal />;
};

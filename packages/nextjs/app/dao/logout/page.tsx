'use client';

import { NextPage } from 'next';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LOCAL_STORAGE_KEYS } from '~~/utils/storage_keys';

const LogOutPage: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.DAO_ADDRESS);
    router.replace('/');
  }, [router]);

  return <section></section>;
};

export default LogOutPage;

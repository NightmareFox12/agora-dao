import { NextPage } from 'next';
import { HeaderDaoList } from './_components/HeaderDaoList';
import { CustomConnectButton } from '~~/components/scaffold-stark/CustomConnectButton';
import { CreateDaoDialog } from './_components/CreateDaoDialog';
import { DaoGrid } from './_components/DaoGrid';

const DaosPage: NextPage = () => {
  return (
    <section className='min-h-screen'>
      <HeaderDaoList />
      <div className='flex justify-center items-center mt-3'>
        <CustomConnectButton />
      </div>
      <CreateDaoDialog />
      <DaoGrid />
    </section>
  );
};

export default DaosPage;

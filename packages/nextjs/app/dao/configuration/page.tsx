'use server';

import { NextPage } from 'next';
import { ModalAdmin } from './_components/AdminModal';
import { RoleSection } from './_components/RoleSection';

const ConfigurationPage: NextPage = async () => {
  return (
    <section>
      <ModalAdmin />
      <div className='tabs tabs-lift justify-center'>
        <label className='tab'>
          <input type='radio' name='my_tabs_4' />
          Live
        </label>
        <div className='tab-content bg-base-100 border-base-300 p-6'>
          Tab content 1
        </div>

        <label className='tab'>
          <input type='radio' name='my_tabs_4' defaultChecked />
          Roles
        </label>
        <div className='tab-content bg-base-300 border-base-300 p-6'>
          <RoleSection />
        </div>
        <label className='tab'>
          <input type='radio' name='my_tabs_4' />
          Love
        </label>
        <div className='tab-content bg-base-100 border-base-300 p-6'>
          Tab content 3
        </div>
      </div>
    </section>
  );
};

export default ConfigurationPage;

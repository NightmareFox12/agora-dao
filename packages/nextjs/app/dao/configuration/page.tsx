'use server';

import { NextPage } from 'next';
import { ModalAdmin } from './_components/AdminModal';
import { Users } from 'lucide-react';
import { CardRole } from './_components/CardRole';

const roles = [
  {
    title: 'Auditor',
    description: 'yeah',
  },
  {
    title: 'Task creator',
    description: 'yeah',
  },
  {
    title: 'Propossal creator',
    description: 'yeah',
  },
  {
    title: 'User Role',
    description: 'Can accept tasks and participate in voting.',
  },
];

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
          <section className='sm:px-2 lg:px-4 grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* card role */}
            {roles.map((x, y) => (
              <CardRole key={y} title={x.title} description={x.description} />
            ))}
          </section>
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

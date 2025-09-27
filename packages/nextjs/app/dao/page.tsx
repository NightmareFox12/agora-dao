'use server';

import { NextPage } from 'next';
import { AvailableTaskGrid } from './_components/AvailableTaskGrid';
import { FolderOpen } from 'lucide-react';
import { TaskClientController } from './_components/TaskClientController';

const TaskPage: NextPage = async () => {
  return (
    <section>
      <TaskClientController />

      <div>
        <div className='tabs tabs-lift flex justify-center'>
          <label className='tab'>
            <input type='radio' name='my_tabs_4' defaultChecked />
            <FolderOpen className='size-4 me-2' />
            Available
          </label>
          <div className='tab-content bg-base-100 border-base-300 p-6'>
            <AvailableTaskGrid />
          </div>

          <label className='tab'>
            <input type='radio' name='my_tabs_4' />
            Created
          </label>
          <div className='tab-content bg-base-100 border-base-300 p-6'>
            Tab content 2
          </div>

          <label className='tab'>
            <input type='radio' name='my_tabs_4' />
            Accepted
          </label>
          <div className='tab-content bg-base-100 border-base-300 p-6'>
            Tab content 3
          </div>
        </div>
      </div>
    </section>
  );
};

export default TaskPage;

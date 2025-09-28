'use server';

import { NextPage } from 'next';
import { FilePen, FolderOpen } from 'lucide-react';
import { TaskClientController } from './_components/TaskClientController';
import { TaskGrid } from './_components/TaskGrid';

const TaskPage: NextPage = async () => {
  //components
  const TaskTabSection = ({
    tabName,
  }: {
    tabName: 'available' | 'created' | 'accepted';
  }) => (
    <div className='tab-content bg-base-100 border-base-300 p-6'>
      <TaskGrid tabName={tabName} />
    </div>
  );

  return (
    <section>
      <TaskClientController />

      {/* Tabs */}
      <div>
        <div className='tabs tabs-lift flex justify-center'>
          <label className='tab'>
            <input type='radio' name='task_section' defaultChecked />
            <FolderOpen className='size-4 me-2' />
            Available
          </label>
          <TaskTabSection tabName='available' />

          <label className='tab'>
            <input type='radio' name='task_section' />
            <FilePen className='size-4 me-2' />
            Created
          </label>
          <TaskTabSection tabName='created' />

          <label className='tab'>
            <input type='radio' name='task_section' />
            Accepted
          </label>
          <TaskTabSection tabName='accepted' />
        </div>
      </div>
    </section>
  );
};

export default TaskPage;

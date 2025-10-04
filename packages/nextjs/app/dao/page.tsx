'use server';

import { NextPage } from 'next';
import { FilePen, FolderOpen } from 'lucide-react';
import { TaskClientController } from './_components/TaskClientController';
import { TaskGrid } from './_components/TaskGrid';
import { AvailableSpanTaskCounter } from './_components/TabCounters';

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

const TaskPage: NextPage = () => {
  return (
    <section>
      <TaskClientController />

      {/* Tabs */}
      <div>
        <div className='tabs tabs-lift flex justify-center'>
          <label className='tab'>
            <input type='radio' name='task_section' defaultChecked />
            <AvailableSpanTaskCounter />
            <FolderOpen className='size-4 me-2' />
            Available
          </label>
          <TaskTabSection tabName='available' />

          <label className='tab'>
            <input type='radio' name='task_section' />
            Accepted
          </label>
          <TaskTabSection tabName='accepted' />

          <label className='tab'>
            <input type='radio' name='task_section' />
            <FilePen className='size-4 me-2' />
            Created
          </label>
          <TaskTabSection tabName='created' />
        </div>
      </div>
    </section>
  );
};

export default TaskPage;

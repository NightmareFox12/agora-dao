'use server';

import { NextPage } from 'next';
import { FilePen, FolderOpen } from 'lucide-react';
import { TaskClientController } from './_components/TaskClientController';
import { TaskGrid } from './_components/TaskGrid';
import {
  AvailableTaskCounterSpan,
  CreatedTaskCounterSpan,
} from './_components/TabCounters';

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
            <AvailableTaskCounterSpan />
            <FolderOpen className='size-4 me-2' />
            Available
          </label>
          <TaskTabSection tabName='available' />
          <label className='tab'>
            <input type='radio' name='task_section' />
            <FilePen className='size-4 me-2' />
            Accepted
          </label>
          <TaskTabSection tabName='accepted' />
          <label className='tab'>
            <input type='radio' name='task_section' />
            <CreatedTaskCounterSpan />
            <FilePen className='size-4 me-2' />
            Created
          </label>
          <TaskTabSection tabName='created' />
          Verification required
        </div>
      </div>
    </section>
  );
};

export default TaskPage;

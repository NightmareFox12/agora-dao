import { FilePen, Plus } from 'lucide-react';
import React, { Dispatch, SetStateAction } from 'react';

type TaskFABProps = {
  setShowCreateTaskDialog: Dispatch<SetStateAction<boolean>>;
};

export const TaskFAB: React.FC<TaskFABProps> = ({
  setShowCreateTaskDialog,
}) => {
  return (
    <div className='fab'>
      <button
        onClick={() => setShowCreateTaskDialog(true)}
        className='btn btn-lg btn-circle btn-secondary'
      >
        <Plus className='size-6' />
      </button>
    </div>
  );
};

// <div className='fab'>
//    a focusable div with tabIndex is necessary to work on all browsers. role="button" is necessary for accessibility
//     <div
//       tabIndex={0}
//       role='button'
//       className='btn btn-lg btn-circle btn-secondary'
//     >
//       <Plus className='size-6' />
//     </div>

//     </button>
//     <div className='tooltip tooltip-left' data-tip='Create Task'>
//       <button
//         onClick={() => setShowCreateTaskDialog(true)}
//         className='btn btn-lg btn-circle'
//       >
//         <FilePen className='size-6' />
//       </button>
//     </div>
//   </div>

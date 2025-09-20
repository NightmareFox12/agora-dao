import { Users } from 'lucide-react';

type RoleCardProps = {
  title: string;
  description: string;
  role:
    | 'Role Manager'
    | 'Auditor'
    | 'Task Creator'
    | 'Propossal Creator'
    | 'User';
  counter: bigint | undefined;
  counterLoading: boolean;
  setShowData: React.Dispatch<React.SetStateAction<any>>;
};

export const RoleCard: React.FC<RoleCardProps> = ({
  title,
  description,
  role,
  counter,
  counterLoading,
  setShowData,
}) => {
  return (
    <>
      {counterLoading ? (
        <div className='h-56 w-full skeleton bg-base-200' />
      ) : (
        <div
          onClick={() =>
            setShowData({
              showTable: true,
              role,
            })
          }
          className='card bg-base-200 w-full border border-gradient shadow-sm cursor-pointer hover:scale-[1.03] transition-all delay-75'
        >
          <div className='card-body'>
            <h2 className='card-title'>{title}</h2>
            <p className='mb-0'>{description}</p>
            <div className='flex items-center gap-2'>
              <Users className='w-5 h-5' />
              <p className='my-0'>{counter?.toString() ?? 0} members</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

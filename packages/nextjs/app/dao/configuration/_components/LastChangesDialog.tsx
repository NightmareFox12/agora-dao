import { RefObject } from 'react';
import { useScaffoldEventHistory } from '~~/hooks/scaffold-stark/useScaffoldEventHistory';

type LastChangesDialogProps = {
  daoAddress: string;
};

export const LastChangesDialog: React.FC<LastChangesDialogProps> = ({
  daoAddress,
}) => {
  const { data, isLoading, error } = useScaffoldEventHistory({
    contractName: 'AgoraDao',
    eventName: 'RoleCreated',
    contractAddress: daoAddress,
    fromBlock: BigInt(0),
    // filters: { parameterName: value },
    blockData: true,
    transactionData: false,
    receiptData: false,
    watch: true,
    enabled: true,
  });

  console.log(data);
  return (
    <dialog id='last_changes' className='modal'>
      <div className='modal-box'>
        <h3 className='font-bold text-lg'>Check the last changes</h3>
        <p className='py-4'>Press ESC key or click outside to close</p>

        <div className='overflow-x-auto'>
          <table className='table table-zebra'>
            {/* head */}
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Job</th>
                <th>Favorite Color</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              <tr>
                <th>1</th>
                <td>Cy Ganderton</td>
                <td>Quality Control Specialist</td>
                <td>Blue</td>
              </tr>
              {/* row 2 */}
              <tr>
                <th>2</th>
                <td>Hart Hagerty</td>
                <td>Desktop Support Technician</td>
                <td>Purple</td>
              </tr>
              {/* row 3 */}
              <tr>
                <th>3</th>
                <td>Brice Swyre</td>
                <td>Tax Accountant</td>
                <td>Red</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <form method='dialog' className='modal-backdrop'>
        <button>close</button>
      </form>
    </dialog>
  );
};

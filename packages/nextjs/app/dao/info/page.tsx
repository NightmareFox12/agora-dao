'use server';

import { NextPage } from 'next';
import { InfoClientController } from './_components/InfoClientController';
import { Prueba } from './Prueba';
import { FilePlus2 } from 'lucide-react';

const InfoPage: NextPage = () => {
  return (
    <section className='p-2 sm:p-4'>
      <InfoClientController />
      <div className='grid grid-cols-1 sm:grid-cols-2 sm:gap-6'>
        <div className='card bg-base-300 shadow-sm border-gradient'>
          <div className='card-body'>
            <h2 className='card-title'>Statistics Task</h2>

            {/* name of each tab group should be unique */}
            <div className='tabs tabs-lift justify-center'>
              <label className='tab'>
                <input type='radio' name='my_tabs_4' />
                <FilePlus2 className='size-4 mr-0.5' />
                Created
              </label>
              <div className='tab-content bg-base-100 border-base-300'>
                <p>
                  A card component has a figure, a body part, and inside body
                  there are title and actions parts
                </p>
                <Prueba />
              </div>

              <label className='tab'>
                <input type='radio' name='my_tabs_4' defaultChecked />
                Laugh
              </label>
              <div className='tab-content bg-base-100 border-base-300'>
                Tab content 2
              </div>
            </div>
            {/* <Prueba /> */}
            <div className='card-actions justify-end'>
              <button className='btn btn-primary'>Buy Now</button>
            </div>
          </div>
        </div>

        <div className='card bg-base-300 shadow-sm border-gradient'>
          <div className='card-body'>
            <h2 className='card-title'>Card Title</h2>
            <p>
              A card component has a figure, a body part, and inside body there
              are title and actions parts
            </p>
            <div className='card-actions justify-end'>
              <button className='btn btn-primary'>Buy Now</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
//TODO: aqui poner graficas publicas para qeu todos lo pueda ver
//TODO: crear otra seccion para ver mi profile

export default InfoPage;

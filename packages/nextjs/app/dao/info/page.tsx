'use server';

import { NextPage } from 'next';

const InfoPage: NextPage = () => {
  return (
    <section className='p-2 sm:p-4'>
      <div className='grid grid-cols-1 sm:grid-cols-2 sm:gap-6'>
        <div className='card bg-base-300 shadow-sm border-gradient'>
          <div className='card-body'>
            <h2 className='card-title'>Statistics Task</h2>
            <p>
              A card component has a figure, a body part, and inside body there
              are title and actions parts
            </p>
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

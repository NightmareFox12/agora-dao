'use server';

import { NextPage } from 'next';
import { ModalAdmin } from './_components/AdminModal';

const ConfigurationPage: NextPage = async () => {
  return (
    <section>
      <ModalAdmin />
      <div className='tabs tabs-lift'>
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
          <section className='sm:px-2 lg:px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {/* card */}
            <div className='card bg-base-200 w-full border border-gradient shadow-sm'>
              <div className='card-body'>
                <h2 className='card-title'>Card Title</h2>
                <p>
                  A card component has a figure, a body part, and inside body
                  there are title and actions parts
                </p>
                <div className='card-actions justify-end'>
                  <button className='btn btn-primary'>Buy Now</button>
                </div>
              </div>
            </div>

            <div className='card bg-base-200 w-full border border-gradient shadow-sm'>
              <div className='card-body'>
                <h2 className='card-title'>Card Title</h2>
                <p>
                  A card component has a figure, a body part, and inside body
                  there are title and actions parts
                </p>
                <div className='card-actions justify-end'>
                  <button className='btn btn-primary'>Buy Now</button>
                </div>
              </div>
            </div>

            <div className='card bg-base-200 w-full border border-gradient shadow-sm'>
              <div className='card-body'>
                <h2 className='card-title'>Card Title</h2>
                <p>
                  A card component has a figure, a body part, and inside body
                  there are title and actions parts
                </p>
                <div className='card-actions justify-end'>
                  <button className='btn btn-primary'>Buy Now</button>
                </div>
              </div>
            </div>

            <div className='card bg-base-200 w-full border border-gradient shadow-sm'>
              <div className='card-body'>
                <h2 className='card-title'>Card Title</h2>
                <p>
                  A card component has a figure, a body part, and inside body
                  there are title and actions parts
                </p>
                <div className='card-actions justify-end'>
                  <button className='btn btn-primary'>Buy Now</button>
                </div>
              </div>
            </div>
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

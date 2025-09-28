'use server';

import { NextPage } from 'next';
import { ChartNoAxesCombined, Shield } from 'lucide-react';
import { InfoClientController } from './_components/InfoClientController';

const InfoPage: NextPage = () => {
  return (
    <section>
      <InfoClientController />
      <div className='tabs tabs-lift justify-center'>
        <label className='tab'>
          <input type='radio' name='config_tabs' defaultChecked />
          <ChartNoAxesCombined className='w-5 h-5 mr-1' />
          DAO
        </label>
        <div className='tab-content bg-base-100 border-base-300 p-6'>
          aqui reventar de graficas
        </div>
      </div>
    </section>
  );
};

export default InfoPage;

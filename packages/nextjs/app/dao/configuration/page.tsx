'use server';

import { NextPage } from 'next';
import { RoleSection } from './_components/RoleSection';
import { ConfigurationClientController } from './_components/ConfigurationClientController';
import { ChartNoAxesColumn, ChartNoAxesCombined, Shield } from 'lucide-react';

const ConfigurationPage: NextPage = async () => {
  return (
    <section>
      <ConfigurationClientController />
      <div className='tabs tabs-lift justify-center'>
        <label className='tab'>
          <input type='radio' name='config_tabs' defaultChecked />
          <ChartNoAxesCombined className='w-5 h-5 mr-1' />
          Summary
        </label>
        <div className='tab-content bg-base-100 border-base-300 p-6'>
          aqui reventar de graficas
        </div>

        <label className='tab'>
          <input type='radio' name='config_tabs' />
          <Shield className='w-5 h-5 mr-1' />
          Roles
        </label>
        <div className='tab-content bg-base-300 border-base-300 p-6 rounded-none'>
          <RoleSection />
        </div>
        <label className='tab'>
          <input type='radio' name='config_tabs' />
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

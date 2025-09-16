'use client';

//TODO: pinnata eliminacion tambien,si el usuario rechaza la metamask
//TODO: inventarme la de la vaina de acceso para daos privadas
//TODO: en el header poner el nombre de mi dao actual. Tambien que puedas customizar el color del header de mi dao... o mejor dicho, el color primario (o agregar a premium)

import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CircleQuestionMarkIcon,
  Loader,
  Plus,
  Rocket,
  Trash,
  Upload,
  X,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import RotatingText from '~~/components/ui/RotatingText';
import { useScaffoldWriteContract } from '~~/hooks/scaffold-stark/useScaffoldWriteContract';
import { DaoFormSchema } from '~~/libs/schemas/dao.schema';
import toast from 'react-hot-toast';
import { useScaffoldReadContract } from '~~/hooks/scaffold-stark/useScaffoldReadContract';

export const CreateDaoDialog: React.FC = () => {
  //states
  const [loadImage, setLoadImage] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);

  //refs
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Form
  const daoForm = useForm<z.infer<typeof DaoFormSchema>>({
    resolver: zodResolver(DaoFormSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      description: '',
      categories: undefined,
      logo: undefined,
      isPublic: true,
    },
  });

  //Subscriptions
  const {
    name: nameWatch,
    description: descriptionWatch,
    categories: categoriesWatch,
    logo: logoWatch,
    isPublic: isPublicWatch,
  } = daoForm.watch();

  //Smart contract
  const { sendAsync } = useScaffoldWriteContract({
    contractName: 'AgoraDaoFabric',
    functionName: 'create_dao',
    args: ['', '', 0n, '', false],
  });

  const { data: daoCategories, isLoading: daoCategoriesLoading } =
    useScaffoldReadContract({
      contractName: 'AgoraDaoFabric',
      functionName: 'get_all_categories',
    });

  //effects
  useEffect(() => {
    if (!loadImage) return;
    setProgress(0);
    daoForm.setValue('logo', undefined);
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 2;
        return next >= 100 ? 100 : next;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [daoForm, loadImage]);

  //functions
  const isUploadFormImage = async (e: ChangeEvent<HTMLInputElement>) => {
    setLoadImage(true);
    const file = e.target.files?.[0];
    if (!file) {
      setLoadImage(false);
      return;
    }

    setLoadImage(false);

    if (file.size >= 1024 * 1024) {
      daoForm.setError('logo', { message: 'The image is greater than 1MB' });
      return undefined;
    }

    daoForm.clearErrors('logo');
    return file;
  };

  const onSubmit = async (data: z.infer<typeof DaoFormSchema>) => {
    try {
      setSubmitLoading(true);
      let res: { response: string; cid: string } | undefined;
      if (data.logo) {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('logo', data.logo);

        const req = await fetch('/api/upload-image', {
          method: 'POST',
          body: formData,
        });

        res = await req.json();
        if (!req.ok) return toast.error(res!.response);
      }

      await sendAsync({
        args: [
          data.name,
          data.description,
          BigInt(data.categories ?? 0),
          res?.cid ?? '',
          data.isPublic,
        ],
      });
      daoForm.reset();

      dialogRef.current?.close();
      toast.success('DAO created successfully', { duration: 5000 });
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <>
      {/* Button Modal */}
      <div className='flex justify-center p-3'>
        <button
          className='btn btn-accent'
          onClick={() => dialogRef.current?.showModal()}
        >
          <Plus className='w-4 h-4' />

          <RotatingText
            texts={[
              'Create DAO',
              'Launch DAO',
              'Descentralize Now',
              'Start DAO',
            ]}
            mainClassName='px-2 sm:px-2 md:px-3 overflow-hidden  justify-center rounded-lg'
            staggerFrom={'last'}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-120%' }}
            staggerDuration={0.025}
            splitLevelClassName='overflow-hidden pb-0.5 sm:pb-1 md:pb-1'
            elementLevelClassName='text-primary-foreground'
            transition={{ type: 'tween', damping: 30, stiffness: 400 }}
            rotationInterval={5000}
          />
        </button>
      </div>

      <dialog ref={dialogRef} id='create_dao_modal' className='modal'>
        <div className='modal-box sm:w-6/12 sm:!max-w-3xl md:w-6/12 md:!max-w-5xl max-h-[80dvh] !overflow-y-visible'>
          <button
            disabled={submitLoading}
            onClick={() => dialogRef.current?.close()}
            className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'
          >
            <X className='w-4 h-4' />
          </button>
          <h3 className='font-bold text-lg'>⚒️ Create your DAO!</h3>
          <p className='text-sm text-base-content/60'>
            Once you have completed all the required fields press the
            &quot;Launch DAO&quot; button.
          </p>

          <form
            onSubmit={daoForm.handleSubmit(onSubmit)}
            autoComplete='off'
            autoCapitalize='sentences'
            className='-space-y-1 px-1'
          >
            {/* name */}
            <fieldset className='fieldset'>
              <legend className='fieldset-legend text-[13px]'>
                Name
                <span className='-ml-1 text-error font-bold text-bold'>*</span>
              </legend>
              <input
                {...daoForm.register('name')}
                className='input w-full bg-base-300'
                placeholder='e.g. Governance Stark'
              />
              <div className='flex justify-between'>
                {daoForm.formState.errors.name ? (
                  <p className='label text-error my-0'>
                    {daoForm.formState.errors.name.message}
                  </p>
                ) : (
                  <span />
                )}

                <p className='label my-0'>{nameWatch?.length ?? 0}/30</p>
              </div>
            </fieldset>

            {/* description */}
            <fieldset className='fieldset'>
              <legend className='fieldset-legend text-[13px]'>
                Description
                <span className='-ml-1 text-error font-bold text-bold'>*</span>
              </legend>
              <textarea
                {...daoForm.register('description')}
                placeholder='e.g. A decentralized organization that enables transparent decision-making, in which users actively participate in the financing and management of community-driven projects.'
                className='textarea resize-none h-28 w-full bg-base-300'
              />
              <div className='flex justify-between'>
                {daoForm.formState.errors.description ? (
                  <p className='label text-error my-0'>
                    {daoForm.formState.errors.description.message}
                  </p>
                ) : (
                  <span />
                )}

                <p className='label my-0'>
                  {descriptionWatch?.length ?? 0}/400
                </p>
              </div>
            </fieldset>

            {/* categories */}
            {daoCategoriesLoading || daoCategories === undefined ? (
              <div className='h-10 w-full skeleton bg-primary' />
            ) : (
              <fieldset className='fieldset'>
                <legend className='fieldset-legend'>
                  Categories
                  <span className='-ml-1 text-error font-bold text-bold'>
                    *
                  </span>
                </legend>
                <select
                  value={categoriesWatch ?? ''}
                  {...daoForm.register('categories')}
                  className='select w-full bg-base-300'
                >
                  <option disabled={true}>Pick a category</option>
                  {daoCategories.map((x, y) => (
                    <option key={y} value={y.toString()}>
                      {x.toString()}
                    </option>
                  ))}
                </select>
                {daoForm.formState.errors.categories && (
                  <span className='label text-error my-0'>
                    {daoForm.formState.errors.categories.message}
                  </span>
                )}
              </fieldset>
            )}

            {/* logo */}
            <fieldset className='fieldset'>
              <legend className='fieldset-legend w-full ml-2'>
                <article className='w-full flex justify-between items-center'>
                  <p>Logo</p>

                  <div
                    className='tooltip tooltip-left'
                    data-tip='Choose the logo that your DAO will represent. This field is optional and can be modified later.'
                  >
                    <button className='btn btn-sm btn-ghost rounded-full'>
                      <CircleQuestionMarkIcon className='w-4 h-4' />
                    </button>
                  </div>
                </article>
              </legend>
              <div className='relative h-60 bg-accent rounded-lg flex flex-col items-center justify-center overflow-hidden mx-1 border'>
                <input
                  type='file'
                  onClick={(e) => (e.currentTarget.value = '')}
                  onChange={async (e) => {
                    const file = await isUploadFormImage(e);
                    if (file !== undefined) daoForm.setValue('logo', file);
                  }}
                  disabled={submitLoading}
                  accept='.jpeg,.png,.jpg'
                  className='absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20'
                />

                {logoWatch !== undefined ? (
                  <div className='relative w-full h-auto overflow-hidden'>
                    {
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={URL.createObjectURL(logoWatch)}
                        alt='logo DAO'
                        className='w-full h-auto object-cover block z-10'
                        style={{ position: 'relative' }}
                      />
                    }

                    {/* Button */}
                    <div className='absolute top-0 right-0.5 z-30'>
                      <button
                        type='button'
                        onClick={() => {
                          daoForm.setValue('logo', undefined);
                        }}
                        disabled={submitLoading}
                        className='btn btn-error text-primary-content rounded-full p-3'
                      >
                        <Trash className='w-4 h-4' />
                      </button>
                    </div>
                  </div>
                ) : !loadImage ? (
                  <div
                    className={`absolute inset-0 flex flex-col justify-center items-center pointer-events-none z-10 p-0.5 ${daoForm.formState.errors.logo ? 'text-error' : ''}`}
                  >
                    <Upload className='w-10 h-10' />
                    <p className='my-0 font-semibold'>
                      Choose or drag an image
                    </p>
                    <span className='font-semibold'>
                      The image must be less than 1 MB
                    </span>
                    <span className='text-center text-[13px]'>
                      It is recommended that the appearance of the image be
                      100x100
                    </span>
                  </div>
                ) : (
                  <div className='w-full h-full px-4 flex justify-center items-center'>
                    <progress
                      className='progress w-full'
                      value={progress}
                      max='100'
                    />
                  </div>
                )}
              </div>

              {daoForm.formState.errors.logo ? (
                <p className='label my-0 text-error ml-2'>
                  {daoForm.formState.errors.logo.message}
                </p>
              ) : (
                <p className='label my-0 ml-2'>Optional</p>
              )}
            </fieldset>

            {/* Is Public */}
            <fieldset className='fieldset'>
              <legend className='fieldset-legend w-full'>
                <article className='w-full flex justify-between items-center'>
                  <div className='flex gap-2'>
                    <p className='m-0'> DAO Visibility</p>
                    <span className='text-error font-bold text-bold'>*</span>
                  </div>
                  <div
                    className='tooltip tooltip-left'
                    data-tip='In any public DAO, anyone can join and help the growth of the community. A private DAO can only join those users who have the link (private DAO will not appear in the search engine)'
                  >
                    <button className='btn btn-sm btn-ghost rounded-full'>
                      <CircleQuestionMarkIcon className='w-4 h-4' />
                    </button>
                  </div>
                </article>
              </legend>
              <div className='flex justify-center gap-2 items-center'>
                <p className='m-0 text-sm font-semibold'>
                  {isPublicWatch ? 'Public' : 'Private'} DAO
                </p>
                <input
                  type='checkbox'
                  checked={isPublicWatch}
                  onChange={(e) =>
                    daoForm.setValue('isPublic', e.currentTarget.checked)
                  }
                  className='toggle'
                />
              </div>
              {/* <span className='label text-error my-0'>Optional</span> */}
            </fieldset>

            {/* Action Buttons */}
            <div className='modal-action justify-center'>
              <div>
                <button
                  type='button'
                  onClick={() => daoForm.reset()}
                  disabled={submitLoading}
                  className='btn btn-error mr-6'
                >
                  <Trash className='w-4 h-4' />
                  Clear all
                </button>

                <button
                  type='submit'
                  disabled={
                    daoCategoriesLoading ||
                    submitLoading ||
                    !daoForm.formState.isValid
                  }
                  className='btn btn-accent'
                >
                  {daoCategoriesLoading || submitLoading ? (
                    <>
                      <Loader className='w-4 h-4 animate-spin' />
                      Creating DAO
                    </>
                  ) : (
                    <>
                      <Rocket className='w-4 h-4' /> Launch DAO
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
};

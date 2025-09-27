'use client';

import {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader, Pen, Trash, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useScaffoldReadContract } from '~~/hooks/scaffold-stark/useScaffoldReadContract';
import { TaskFormSchema } from '~~/libs/schemas/task.schema';
import { StarkInput } from '~~/components/scaffold-stark';
import { DayPicker } from 'react-day-picker';
import { useAccount } from '~~/hooks/useAccount';
import { formatEther, parseEther } from 'ethers';
import useScaffoldStrkBalance from '~~/hooks/scaffold-stark/useScaffoldStrkBalance';
import { useScaffoldMultiWriteContract } from '~~/hooks/scaffold-stark/useScaffoldMultiWriteContract';

type CreateTaskDialogProps = {
  daoAddress: string;
  setShowCreateTaskDialog: Dispatch<SetStateAction<boolean>>;
};

export const CreateTaskDialog: React.FC<CreateTaskDialogProps> = ({
  daoAddress,
  setShowCreateTaskDialog,
}) => {
  const { address } = useAccount();

  const threeDaysLater = new Date();
  threeDaysLater.setDate(threeDaysLater.getDate() + 3);

  const oneDayLater = new Date();
  oneDayLater.setDate(oneDayLater.getDate() + 1);

  //states
  const [showDeadLine, setShowDeadline] = useState<boolean>(true);

  const createTaskArgsRef = useRef({
    title: '',
    description: '',
    category: 0n,
    difficulty: 0n,
    reward: 0n,
    deadline: 0n,
  });

  const [submitLoading, setSubmitLoading] = useState<boolean>(false);

  //refs
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Form
  const taskForm = useForm<z.infer<typeof TaskFormSchema>>({
    resolver: zodResolver(TaskFormSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      category: 'default',
      difficulty: 'default',
      reward: undefined,
      deadline: threeDaysLater,
    },
  });

  //Subscriptions
  const {
    title: nameWatch,
    description: descriptionWatch,
    reward: amountWatch,
    deadline: deadlineWatch,
  } = taskForm.watch();

  //functions
  const buildArgs = () => {
    const values = taskForm.getValues();

    const formatDeadLine = showDeadLine
      ? BigInt(Math.floor(values.deadline!.getTime() / 1000))
      : 0n;

    const safeBigInt = (val: string) =>
      val && val !== 'default' ? BigInt(val) : 0n;

    return [
      values.title,
      values.description,
      safeBigInt(values.category),
      safeBigInt(values.difficulty),
      parseEther(
        isNaN(parseFloat(values.reward)) ? '0' : (values.reward ?? 0n)
      ),
      formatDeadLine,
    ] as const;
  };

  const onSubmit = async (data: z.infer<typeof TaskFormSchema>) => {
    try {
      setSubmitLoading(true);

      const formatDeadLine = showDeadLine
        ? BigInt(Math.floor(data.deadline!.getTime() / 1000))
        : 0n;

      createTaskArgsRef.current = {
        title: data.title,
        description: data.description,
        category: BigInt(data.category),
        difficulty: BigInt(data.difficulty),
        reward: parseEther(data.reward),
        deadline: formatDeadLine,
      };

      buildArgs();

      await sendAsync();
      taskForm.reset();

      toast.dismiss();
      toast.success('Task created successfully!', { duration: 3000 });
      setShowCreateTaskDialog(false);
    } catch (err: any) {
      console.log(err);
    } finally {
      setSubmitLoading(false);
    }
  };

  //Smart contract
  const { data: isAdmin } = useScaffoldReadContract({
    contractName: 'AgoraDao',
    functionName: 'is_admin_role',
    args: [address],
    contractAddress: daoAddress,
    watch: false,
  });

  const { data: isTaskCreator } = useScaffoldReadContract({
    contractName: 'AgoraDao',
    functionName: 'is_task_creator_role',
    args: [address],
    contractAddress: daoAddress,
    watch: false,
  });

  const { value: userBalance, isLoading: userBalanceLoading } =
    useScaffoldStrkBalance({
      address,
    });

  const { sendAsync } = useScaffoldMultiWriteContract({
    calls: [
      {
        contractName: 'Strk',
        functionName: 'approve',
        args: [
          daoAddress,
          parseEther(
            isNaN(parseFloat(amountWatch))
              ? '0'
              : (amountWatch?.toString() ?? '0')
          ),
        ],
      },
      {
        contractName: 'AgoraDao',
        functionName: 'create_task',
        args: buildArgs(),
        contractAddress: daoAddress,
      },
    ],
  });

  const { data: taskCategories, isLoading: taskCategoriesLoading } =
    useScaffoldReadContract({
      contractName: 'AgoraDao',
      functionName: 'get_task_categories',
      contractAddress: daoAddress,
    });

  const { data: taskDifficulties, isLoading: taskDifficultiesLoading } =
    useScaffoldReadContract({
      contractName: 'AgoraDao',
      functionName: 'get_task_difficulties',
      contractAddress: daoAddress,
    });

  //parsed data
  const isAdminParsed = useMemo(
    () => isAdmin as any as boolean | undefined,
    [isAdmin]
  );

  const isTaskCreatorParsed = useMemo(
    () => isTaskCreator as any as boolean | undefined,
    [isTaskCreator]
  );

  //effects
  useEffect(() => {
    const num = parseFloat(amountWatch ?? 0);

    if (isNaN(num)) {
      taskForm.setError('reward', {
        message: 'Amount is not empty',
      });
      return;
    }

    if (!isNaN(num) && num < 0) {
      taskForm.setError('reward', {
        message: 'Amount must be a positive number',
      });
      return;
    }

    if (!isNaN(num) && num > 0) {
      const userBa = formatEther(userBalance?.toString() ?? '0');

      if (num > parseFloat(userBa)) {
        taskForm.setError('reward', {
          message: 'Insufficient balance',
        });
      } else {
        taskForm.clearErrors('reward');
        taskForm.trigger('reward');
      }
    }
  }, [amountWatch, taskForm, , userBalance]);

  return (
    <dialog ref={dialogRef} open={true} id='create_dao_modal' className='modal'>
      <div className='modal-box sm:w-6/12 sm:!max-w-3xl md:w-6/12 md:!max-w-5xl max-h-[80dvh] !overflow-y-visible'>
        <button
          disabled={submitLoading}
          onClick={() => {
            dialogRef.current?.close();
            setShowCreateTaskDialog(false);
          }}
          className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'
        >
          <X className='w-4 h-4' />
        </button>
        <h3 className='font-bold text-lg'>📄 Create a Task</h3>
        <p className='text-sm text-base-content/60'>
          Fill in all the required fields to register this task in the DAO. Once
          you are ready, click &quot;Create Task&quot; to continue.
        </p>

        <form
          onSubmit={taskForm.handleSubmit(onSubmit)}
          autoCapitalize='sentences'
          className='space-y-1 px-1'
        >
          {/* title */}
          <fieldset className='fieldset'>
            <legend className='fieldset-legend text-[13px]'>
              Title
              <span className='-ml-1 text-error font-bold text-bold'>*</span>
            </legend>
            <input
              {...taskForm.register('title')}
              className='input w-full bg-base-300'
              placeholder='e.g. I am looking for a designer for my educational NFT idea.'
            />
            <div className='flex justify-between'>
              {taskForm.formState.errors.title ? (
                <p className='label text-error my-0'>
                  {taskForm.formState.errors.title.message}
                </p>
              ) : (
                <span />
              )}

              <p className='label my-0'>{nameWatch?.length ?? 0}/50</p>
            </div>
          </fieldset>

          {/* description */}
          <fieldset className='fieldset'>
            <legend className='fieldset-legend text-[13px]'>
              Description
              <span className='-ml-1 text-error font-bold text-bold'>*</span>
            </legend>
            <textarea
              {...taskForm.register('description')}
              placeholder='e.g. I am developing a collection of NFTs with an educational focus, designed to teach basic concepts of blockchain and decentralization in a visual and accessible way. I am looking for a designer with creative sensibility and experience in digital illustration who wants to collaborate on the creation of the first prototypes. The idea is to combine art with pedagogy, so if you are interested in the intersection between design and education, this task is for you. Previous experience with NFTs is not necessary, but a desire to experiment and build something meaningful is.'
              className='textarea resize-none h-40 w-full bg-base-300'
            />
            <div className='flex justify-between'>
              {taskForm.formState.errors.description ? (
                <p className='label text-error my-0'>
                  {taskForm.formState.errors.description.message}
                </p>
              ) : (
                <span />
              )}

              <p className='label my-0'>{descriptionWatch?.length ?? 0}/1000</p>
            </div>
          </fieldset>

          {/* categories */}
          {taskCategoriesLoading || taskCategories === undefined ? (
            <div className='h-10 w-full skeleton bg-primary' />
          ) : (
            <fieldset className='fieldset'>
              <legend className='fieldset-legend'>
                Category
                <span className='-ml-1 text-error font-bold text-bold'>*</span>
              </legend>
              <select
                {...taskForm.register('category')}
                className='select w-full bg-base-300'
              >
                <option value='default' disabled={true}>
                  Pick a category
                </option>
                {taskCategories.map((x, y) => (
                  <option key={y} value={y.toString()}>
                    {x.toString()}
                  </option>
                ))}
              </select>
              {taskForm.formState.errors.category && (
                <span className='label text-error my-0'>
                  {taskForm.formState.errors.category.message}
                </span>
              )}
            </fieldset>
          )}

          {/* difficulty level */}
          {taskDifficultiesLoading || taskDifficulties === undefined ? (
            <div className='h-10 w-full skeleton bg-primary' />
          ) : (
            <fieldset className='fieldset'>
              <legend className='fieldset-legend'>
                Difficulty
                <span className='-ml-1 text-error font-bold text-bold'>*</span>
              </legend>
              <select
                {...taskForm.register('difficulty')}
                className='select w-full bg-base-300'
              >
                <option value='default' disabled={true}>
                  Pick a Difficulty
                </option>
                {taskDifficulties.map((x, y) => (
                  <option key={y} value={y.toString()}>
                    {x.toString()}
                  </option>
                ))}
              </select>
              {taskForm.formState.errors.difficulty && (
                <span className='label text-error my-0'>
                  {taskForm.formState.errors.difficulty.message}
                </span>
              )}
            </fieldset>
          )}

          {/* Reward */}
          <fieldset className='fieldset'>
            <legend className='fieldset-legend text-[13px]'>
              Reward
              <span className=' text-error font-bold text-bold'>*</span>
            </legend>
            <StarkInput
              {...taskForm.register('reward')}
              value={amountWatch}
              onChange={(value) => taskForm.setValue('reward', value)}
              placeholder='Enter the reward amount'
            />

            <div className='flex justify-between'>
              {taskForm.formState.errors.reward ? (
                <p className='label text-error my-0'>
                  {taskForm.formState.errors.reward.message}
                </p>
              ) : (
                <span />
              )}
            </div>
          </fieldset>

          {/* DeadLine */}
          <fieldset className='fieldset'>
            <legend className='fieldset-legend text-[13px]'>Due Date</legend>
            <div className='flex items-center gap-1'>
              <input
                type='checkbox'
                checked={showDeadLine}
                onChange={(e) => setShowDeadline(e.target.checked)}
                className='checkbox'
              />

              <>
                <button
                  popoverTarget='rdp-popover'
                  type='button'
                  disabled={submitLoading || !showDeadLine}
                  className='input input-border bg-base-300 w-full'
                  style={{ anchorName: '--rdp' } as React.CSSProperties}
                >
                  {deadlineWatch
                    ? deadlineWatch.toLocaleDateString()
                    : 'Pick a date'}
                </button>
                <div
                  popover='auto'
                  id='rdp-popover'
                  className='dropdown'
                  style={
                    {
                      positionAnchor: '--rdp',
                      positionArea: 'top',
                    } as React.CSSProperties
                  }
                >
                  <DayPicker
                    className='react-day-picker'
                    mode='single'
                    selected={deadlineWatch}
                    onSelect={(date) => taskForm.setValue('deadline', date)}
                    startMonth={new Date()}
                    hidden={{
                      before: oneDayLater,
                    }}
                  />
                </div>
              </>
            </div>
            <div className='flex justify-between'>
              {taskForm.formState.errors.deadline ? (
                <p className='label text-error my-0'>
                  {taskForm.formState.errors.deadline.message}
                </p>
              ) : (
                <p className='label my-0'>Optional</p>
              )}
            </div>
          </fieldset>

          {/* Questions */}
          <details className='collapse collapse-arrow bg-base-300 border'>
            <summary className='collapse-title font-semibold'>
              What about the reward?
            </summary>
            <div className='collapse-content text-sm'>
              Upon confirmation of this task, the reward will be deposited into
              the DAO smart contract. Your money will not be spent or withdrawn
              by anyone. It will remain associated exclusively with this task
              and will only be released when:
              <br />
              <br />
              - The task is completed and approved
              <br />- The deadline expires without execution (you will be able
              to recover your funds)
              <br />- The task is canceled by the creator, provided no one has
              accepted it yet (you will be able to recover your funds)
              <br />- If no deadline is set, the creator can reclaim the funds
              after 60 days of inactivity by the assigned user (to prevent tasks
              from being stuck)
            </div>
          </details>
          <details className='collapse collapse-arrow bg-base-300 border'>
            <summary className='collapse-title font-semibold'>
              Who can create tasks?
            </summary>
            <div className='collapse-content text-sm'>
              Task creation is a privileged action, restricted to ensure
              platform security and quality. Only the following users are
              authorized to create new tasks:
              <br />
              <br />
              - Admin: This role is assigned only to the DAO creator/owner and
              grants full permissions across the platform.
              <br />- Task Creator: Users explicitly assigned this role by an
              Admin or a Roles Manager user. This allows teams and key members
              to contribute to the task backlog without having full Admin
              rights.
              <br />
              <br />
              If you need to create a task but do not have one of these roles,
              please contact your DAO Admin.
            </div>
          </details>

          {/* Action Buttons */}
          <div className='modal-action flex-col items-center'>
            {(isAdminParsed === false || isTaskCreatorParsed === false) && (
              <p className='my-1 text-error text-sm font-semibold'>
                Only Admin or Task Creator.
              </p>
            )}

            {(isAdminParsed === true || isTaskCreatorParsed === true) && (
              <div>
                <button
                  type='button'
                  onClick={() => taskForm.reset()}
                  disabled={submitLoading}
                  className='btn btn-error mr-6'
                >
                  <Trash className='w-4 h-4' />
                  Clear all
                </button>

                <button
                  type='submit'
                  disabled={
                    taskCategoriesLoading ||
                    taskDifficultiesLoading ||
                    taskForm.formState.isSubmitting ||
                    userBalanceLoading ||
                    submitLoading ||
                    !taskForm.formState.isValid
                  }
                  className='btn btn-accent'
                >
                  {submitLoading ? (
                    <>
                      <Loader className='w-4 h-4 animate-spin' />
                      Creating Task...
                    </>
                  ) : (
                    <>
                      <Pen className='w-4 h-4' /> Create Task
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </dialog>
  );
};

//TODO: poner el dialog a funcionar con todos los roles y hacer verfiicaciones para evitar que coloque la addres con que esta conectado.

//TODO: el role manager puede modificar los roles de usuario,crea tarea y crea propuesta. y solo eliminar 3 veces por dia

//TODO: crear una card de eventos para que se vea que esta hciendo el task manager y asi el admin pueda eliminiarlo en caso que se vuelva asesino

//TODO: hacer verificaciones especiales si el rol tiene aceptada una tarea o creo una y esta en progreso. porque si se le afecta el rol hay que tener eso en cuenta

//TODO: agregar un modal de primera vez para decirle que vaya a editar los permisos

//TODO: luego de subir mi primer tarea hacer lo de los roles para que no todos puedan subir tareas

//TODO: en config establecer lo de los roles con graficas y data

//TODO: poder quitar rol si eres admin

//TODO: aceptar task y emit event

//TODO: pensar en lo del contacto. LA IA me dice que puedo crear un campo para que agreguen el correo o crear en la tarea un apartado para reaccionar y enviar mensajes al creador asi mantener todo descentralizado

//TODO: pinnata eliminacion tambien,si el usuario rechaza la metamask
//TODO: inventarme la de la vaina de acceso para daos privadas
//TODO: en el header poner el nombre de mi dao actual. Tambien que puedas customizar el color del header de mi dao... o mejor dicho, el color primario (o agregar a premium)

// TODO: mejorar la tabla y el modal de crear rol para que sea general y pueda cambiar segun el rol que se abre en vez de crear 4 tablas y 4 modales de agregar rol para una cosa que es lo mismo we

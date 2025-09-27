import { CairoCustomEnum } from 'starknet';

export interface ITask {
  task_id: bigint;
  creator: bigint;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  reward: bigint;
  deadline: bigint;
  status: CairoCustomEnum;
}

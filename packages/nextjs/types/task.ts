import { BigNumberish, CairoCustomEnum, CairoOption } from 'starknet';

export interface ITask {
  task_id: bigint;
  creator: bigint;
  title: string;
  description: string;
  category: string;
  difficulty: 'TRIVIAL' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  reward: bigint;
  deadline: bigint;
  status: CairoCustomEnum;
  accepted_by: CairoOption<BigNumberish>;
}

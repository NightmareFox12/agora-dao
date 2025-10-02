'use client';

import React, { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '~~/components/ui/chart';
import { useScaffoldEventHistory } from '~~/hooks/scaffold-stark/useScaffoldEventHistory';
import { useDaoState } from '~~/services/store/dao';

type StaticsTaskChartProps = {
  type: 'created' | 'finished';
};

export const StaticsTaskChart: React.FC<StaticsTaskChartProps> = ({ type }) => {
  const chartConfig = {
    tasks: {
      label: 'Tasks',
      color: type === 'created' ? 'var(--chart-1)' : 'var(--chart-3)',
    },
  } satisfies ChartConfig;

  const { daoAddress } = useDaoState();

  const { data: taskCreated, isLoading } = useScaffoldEventHistory({
    contractName: 'AgoraDao',
    eventName: 'TaskCreated',
    contractAddress: daoAddress,
    fromBlock: BigInt(0),
    filters: { parameterName: 'd' },
    blockData: true,
    transactionData: false,
    receiptData: false,
    watch: false,
    enabled: true,
  });

  const chartData = useMemo(() => {
    if (!taskCreated || taskCreated.length === 0 || isLoading) return [];

    // Inicializamos el contador por día
    const dayCounts: Record<string, number> = {
      Monday: 0,
      Tuesday: 0,
      Wednesday: 0,
      Thursday: 0,
      Friday: 0,
      Saturday: 0,
      Sunday: 0,
    };

    // Procesamos cada evento
    taskCreated.forEach((event) => {
      const timestamp = Number(event.block.timestamp) * 1000; // Convertimos a ms
      const date = new Date(timestamp);
      const dayIndex = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

      const dayNames = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ];

      const dayName = dayNames[dayIndex];
      dayCounts[dayName]++;
    });

    // Convertimos a array como el ejemplo
    const parsed = Object.entries(dayCounts).map(([day, tasks]) => ({
      day,
      tasks,
    }));

    return parsed;
  }, [isLoading, taskCreated]);

  return (
    <div style={{ width: '100%', height: '200px' }}>
      <ChartContainer config={chartConfig}>
        <BarChart accessibilityLayer data={chartData} width={500} height={200}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey='day'
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value: any) => value.slice(0, 3)}
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                className='bg-neutral text-neutral-content '
                hideLabel
              />
            }
          />
          <Bar dataKey='tasks' fill='var(--color-tasks)' radius={8} />
        </BarChart>
      </ChartContainer>
    </div>
  );
};

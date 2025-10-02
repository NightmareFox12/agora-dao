'use client';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '~~/components/ui/chart';

const chartConfig = {
  tasks: {
    label: 'Tasks',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

export const Prueba = () => {
  const chartData = [
    { day: 'Monday', tasks: 186 },
    { day: 'Tuesday', tasks: 30 },
    { day: 'Wednesday', tasks: 86 },
    { day: 'Thursday', tasks: 16 },
    { day: 'Friday', tasks: 46 },
    { day: 'Saturday', tasks: 16 },
    { day: 'Sunday', tasks: 16 },
  ];

  return (
    <>
      <ChartContainer config={chartConfig}>
        <BarChart accessibilityLayer data={chartData}>
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
    </>
  );
};

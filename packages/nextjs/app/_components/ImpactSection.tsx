'use client';

import React from 'react';
import {
  ChartAreaIcon,
  ListOrdered,
  Nut,
  Shield,
  TrendingUp,
  Trophy,
  Users,
  Vote,
} from 'lucide-react';
import CountUp from '~~/components/ui/CountUp';
import { useScaffoldReadContract } from '~~/hooks/scaffold-stark/useScaffoldReadContract';
// import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

export const ImpactSection: React.FC = () => {
  //Smart contract
  const { data: daoCounter, isLoading: daoCounterLoading } =
    useScaffoldReadContract({
      contractName: 'AgoraDaoFabric',
      functionName: 'dao_counter',
    });

  const { data: userCounter, isLoading: userCounterLoading } =
    useScaffoldReadContract({
      contractName: 'AgoraDaoFabric',
      functionName: 'user_counter',
    });

  //components
  const NumbersTab = () => {
    return (
      <article className='tab-content bg-base-200/10 p-2'>
        <div className='grid grid-cols-2 gap-4'>
          {/* DAOs created */}
          {daoCounterLoading ? (
            // <Skeleton className='h-44 rounded-lg bg-primary/20' />
            <div className='skeleton h-44' />
          ) : (
            // <Card className='bg-primary/5 border-primary/20'>
            //   <CardHeader className='text-center'>
            //     <div className='w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2'>
            //       <Trophy className='w-6 h-6 text-primary' />
            //     </div>
            //     <CardTitle className='text-2xl text-primary'>
            //       <CountUp
            //         from={0}
            //         to={
            //           parseInt(daoCounter?.toString() ?? '0') === 0
            //             ? 0
            //             : parseInt(daoCounter?.toString() ?? '0') - 1
            //         }
            //         separator=','
            //         direction='up'
            //         duration={1}
            //         className='count-up-text'
            //       />
            //       +
            //     </CardTitle>
            //     <CardDescription>DAOs created</CardDescription>
            //   </CardHeader>
            // </Card>
            <div className='card bg-base-100/30 shadow-sm'>
              <div className='bg-base-200 p-4 rounded-full flex items-center justify-center mx-auto mt-5'>
                <Trophy className='w-6 h-6' />
              </div>
              <div className='card-body pt-3 gap-0'>
                <h2 className='card-title justify-center text-2xl '>
                  <CountUp
                    from={0}
                    to={
                      parseInt(daoCounter?.toString() ?? '0') === 0
                        ? 0
                        : parseInt(daoCounter?.toString() ?? '0') - 1
                    }
                    separator=','
                    direction='up'
                    duration={1}
                    className='count-up-text'
                  />
                  +
                </h2>
                <p className='text-center my-0'>DAOs created</p>
              </div>
            </div>
          )}

          {/* Users Registered */}
          {userCounterLoading ? (
            <div className='skeleton h-44' />
          ) : (
            <div className='card bg-base-200/20 shadow-sm'>
              <div className='bg-base-200 p-4 rounded-full flex items-center justify-center mx-auto mt-5'>
                <Users className='w-6 h-6' />
              </div>
              <div className='card-body pt-3 gap-0'>
                <h2 className='card-title justify-center text-2xl'>
                  <CountUp
                    from={0}
                    to={
                      parseInt(userCounter?.toString() ?? '0') === 0
                        ? 0
                        : parseInt(userCounter?.toString() ?? '0') - 1
                    }
                    separator=','
                    direction='up'
                    duration={1}
                    className='count-up-text'
                  />
                  +
                </h2>
                <p className='text-center my-0'>Registered Users</p>
              </div>
            </div>
          )}

          {daoCounterLoading && userCounterLoading ? (
            <div className='skeleton h-44' />
          ) : (
            // <Card className='bg-accent/5 border-accent/20'>
            //   <CardHeader className='text-center'>
            //     <div className='w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2'>
            //       <Shield className='w-6 h-6 text-primary' />
            //     </div>
            //     <CardTitle className='text-2xl'>
            //       <CountUp
            //         from={0}
            //         to={100}
            //         separator=','
            //         direction='up'
            //         duration={1}
            //         className='count-up-text'
            //       />
            //       %
            //     </CardTitle>
            //     <CardDescription>Transparencia</CardDescription>
            //   </CardHeader>
            // </Card>
            <div className='card bg-base-200/20 shadow-sm'>
              <div className='bg-base-200 p-4 rounded-full flex items-center justify-center mx-auto mt-5'>
                <Shield className='w-6 h-6' />
              </div>
              <div className='card-body pt-3 gap-0'>
                <h2 className='card-title justify-center text-2xl'>
                  <CountUp
                    from={0}
                    to={100}
                    separator=','
                    direction='up'
                    duration={1}
                    className='count-up-text'
                  />
                  %
                </h2>
                <p className='text-center my-0'>Transparent</p>
              </div>
            </div>
          )}

          <div className='card bg-base-100/30 shadow-sm'>
            <div className='bg-base-200 p-4 rounded-full flex items-center justify-center mx-auto mt-5'>
              <Vote className='w-6 h-6' />
            </div>
            <div className='card-body pt-3 gap-0 '>
              <h2 className='card-title justify-center text-2xl'>
                <CountUp
                  from={0}
                  to={320}
                  separator=','
                  direction='up'
                  duration={1}
                  className='count-up-text'
                />
                +
              </h2>
              <p className='text-center my-0'>Propuestas Votadas</p>
            </div>
          </div>
        </div>
      </article>
    );
  };

  // const ChartsTab = () => {
  //   const chartData = [
  //     { month: 'January', desktop: 186 },
  //     { month: 'February', desktop: 305 },
  //     { month: 'March', desktop: 237 },
  //     { month: 'April', desktop: 73 },
  //     { month: 'May', desktop: 209 },
  //     { month: 'June', desktop: 214 },
  //   ];

  //   const chartConfig = {
  //     desktop: {
  //       label: 'Desktop',
  //       color: 'var(--chart-1)',
  //     },
  //   } satisfies ChartConfig;

  //   return (
  //     <TabsContent value='charts'>
  //       <Card>
  //         <CardHeader>
  //           <CardTitle>Bar Chart</CardTitle>
  //           <CardDescription>January - June 2024</CardDescription>
  //         </CardHeader>
  //         <CardContent>
  //           <ChartContainer config={chartConfig}>
  //             <BarChart accessibilityLayer data={chartData}>
  //               <CartesianGrid vertical={false} />
  //               <XAxis
  //                 dataKey='month'
  //                 tickLine={false}
  //                 tickMargin={10}
  //                 axisLine={false}
  //                 tickFormatter={(value) => value.slice(0, 3)}
  //               />
  //               <ChartTooltip
  //                 cursor={false}
  //                 content={<ChartTooltipContent hideLabel />}
  //               />
  //               <Bar dataKey='desktop' fill='var(--color-desktop)' radius={8} />
  //             </BarChart>
  //           </ChartContainer>
  //         </CardContent>
  //         <CardFooter className='flex-col items-start gap-2 text-sm'>
  //           <div className='flex gap-2 leading-none font-medium'>
  //             Trending up by 5.2% this month <TrendingUp className='h-4 w-4' />
  //           </div>
  //           <div className='text-muted-foreground leading-none'>
  //             Showing total visitors for the last 6 months
  //           </div>
  //         </CardFooter>
  //       </Card>
  //     </TabsContent>
  //   );
  // };

  return (
    <section id='impact' className='py-20 px-4 relative z-10'>
      <div className='container mx-auto'>
        <div className='grid lg:grid-cols-2 gap-12 items-center'>
          <div>
            <h2 className='text-center md:text-left text-3xl md:text-4xl font-bold text-foreground mb-6'>
              Our Impact
            </h2>
            <p className='text-center md:text-left text-lg text-muted-foreground mb-8'>
              At AgoraDAO, every action counts. Our rewards system recognizes
              and rewards active community participation.
            </p>

            {/* <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span className="text-foreground">Tokens de gobernanza por votar</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span className="text-foreground">NFTs exclusivos por completar tareas</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span className="text-foreground">Acceso temprano a nuevas funciones</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span className="text-foreground">Beneficios especiales en el ecosistema</span>
              </div>
            </div> */}
          </div>

          {/* Tabs */}
          {/* <Tabs defaultValue='numbers'>
            <TabsList className='w-full flex justify-center'>
              <TabsTrigger value='numbers'>Numbers</TabsTrigger>
              <TabsTrigger value='charts'>Charts</TabsTrigger>
            </TabsList>

            <NumbersTab />
            <ChartsTab />
          </Tabs> */}

          <div className='tabs tabs-lift'>
            <label className='tab'>
              <input
                type='radio'
                defaultChecked
                name='my_tabs_4'
                className='text-sm font-semibold'
              />
              <ListOrdered className='w-4 h-4 mr-2' />
              Numbers
            </label>
            <NumbersTab />

            {/* <label className='tab'>
              <input type='radio' name='my_tabs_4' defaultChecked />
              <Nut />
              Laugh
            </label>
            <div className='tab-content bg-base-100 border-base-300 p-6'>
              Tab content 2
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
};

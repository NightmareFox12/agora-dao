"use client";

import React from "react";
import { CheckCircle, Shield, Trophy, Users, Vote } from "lucide-react";
import CountUp from "~~/components/ui/CountUp";
import { Card, CardDescription, CardHeader, CardTitle } from "~~/components/ui/shadcn/card";
import { Skeleton } from "~~/components/ui/shadcn/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~~/components/ui/shadcn/tabs";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export const ImpactSection: React.FC = () => {
  //smart contract
  const { data: daoCounter, isLoading: daoCounterLoading } = useScaffoldReadContract({
    contractName: "AgoraDaoFabric",
    functionName: "daoCounter",
  });

  return (
    <section id="impact" className="py-20 px-4 bg-card/30 relative z-10">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Nuestro Impacto</h2>
            <p className="text-lg text-muted-foreground mb-8">
              En AgoraDAO, cada acción cuenta. Nuestro sistema de recompensas reconoce y premia la participación activa
              de la comunidad.
            </p>

            <div className="space-y-4">
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
            </div>
          </div>

          <Tabs defaultValue="account">
            <TabsList className="w-full flex justify-center">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <div className="grid grid-cols-2 gap-4">
                {daoCounterLoading ? (
                  <Skeleton className=" rounded-lg bg-primary/20" />
                ) : (
                  <Card className="bg-primary/5 border-primary/20">
                    <CardHeader className="text-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Trophy className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-2xl text-primary">
                        <CountUp
                          from={0}
                          to={
                            parseInt(daoCounter?.toString() ?? "0") === 0
                              ? 0
                              : parseInt(daoCounter?.toString() ?? "0") - 1
                          }
                          separator=","
                          direction="up"
                          duration={1}
                          className="count-up-text"
                        />
                        +
                      </CardTitle>
                      <CardDescription>DAOs creadas</CardDescription>
                    </CardHeader>
                  </Card>
                )}

                {/* <Card className="bg-primary/5 border-primary/20">
                  <CardHeader className="text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Trophy className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl text-primary">
                      <CountUp from={0} to={850} separator="," direction="up" duration={1} className="count-up-text" />+
                    </CardTitle>
                    <CardDescription>Recompensas Distribuidas</CardDescription>
                  </CardHeader>
                </Card> */}

                <Card className="bg-accent/5 border-accent/20">
                  <CardHeader className="text-center">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Users className="w-6 h-6 text-accent" />
                    </div>
                    <CardTitle className="text-2xl ">
                      <CountUp from={0} to={850} separator="," direction="up" duration={1} className="count-up-text" />+
                    </CardTitle>
                    <CardDescription>Miembros Activos</CardDescription>
                  </CardHeader>
                </Card>

                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader className="text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Vote className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl text-primary">320+</CardTitle>
                    <CardDescription>Propuestas Votadas</CardDescription>
                  </CardHeader>
                </Card>

                <Card className="bg-accent/5 border-accent/20">
                  <CardHeader className="text-center">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Shield className="w-6 h-6 text-accent" />
                    </div>
                    <CardTitle className="text-2xl">
                      <CountUp from={0} to={100} separator="," direction="up" duration={1} className="count-up-text" />%
                    </CardTitle>
                    <CardDescription>Transparencia</CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="password">Change your password here.</TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

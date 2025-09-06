"use client";

import { useEffect } from "react";
import { CreateDaoDialog } from "./_components/CreateDaoDialog";
import { DaoCard } from "./_components/DaoCard";
import { Building, Coins, Frown, Funnel, Gamepad2, Heart, Search, Users, Zap } from "lucide-react";
import { NextPage } from "next";
import { Button } from "~~/components/ui/shadcn/button";
import { Input } from "~~/components/ui/shadcn/input";
import { useHeaderStore } from "~~/services/store/header.store.";

const daos = [
  {
    id: 1,
    name: "DeFi Protocol DAO",
    description:
      "Una organización descentralizada enfocada en el desarrollo de protocolos DeFi innovadores y sostenibles.",
    category: "DeFi",
    members: 1250,
    icon: Coins,
  },
  {
    id: 2,
    name: "GameFi Collective",
    description: "Comunidad de desarrolladores y jugadores creando el futuro de los juegos blockchain.",
    category: "Gaming",
    members: 890,
    icon: Gamepad2,
  },
  {
    id: 3,
    name: "Social Impact DAO",
    description: "Financiando proyectos que generan impacto social positivo a través de tecnología blockchain.",
    category: "Social Impact",
    members: 2100,
    icon: Heart,
  },
  {
    id: 4,
    name: "Infrastructure DAO",
    description: "Construyendo la infraestructura del futuro descentralizado con herramientas y servicios esenciales.",
    category: "Infrastructure",
    members: 567,
    icon: Building,
  },
  {
    id: 5,
    name: "Energy DAO",
    description: "Revolucionando el sector energético con soluciones descentralizadas y sostenibles.",
    category: "Energy",
    members: 743,
    icon: Zap,
  },
  {
    id: 6,
    name: "Creator Economy DAO",
    description: "Empoderando a creadores de contenido con herramientas y financiación descentralizada.",
    category: "Creator Economy",
    members: 1456,
    icon: Users,
  },
];

// const daos: any = [];

const DaosPage: NextPage = () => {
  const { setShowHeader } = useHeaderStore();

  //effects
  useEffect(() => {
    setShowHeader(false);
  }, [setShowHeader]);

  return (
    <main className="min-h-screen bg-background">
      {/* Create Dao Dialog */}
      <CreateDaoDialog />
      {/* Header */}
      <header className="border-b bg-card">
        <div className="xl:container mx-auto px-6 py-1">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl text-center md:text-left font-bold text-balance">Available DAOs</h1>
              <p className="text-center md:text-left text-muted-foreground mt-2 ">
                Discover and join decentralized autonomous organizations
              </p>
            </div>
            <div className="flex gap-4 mb-2 justify-center md:mb-0 md:justify-start">
              <div className="relative w-full md:max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Buscar DAOs..." className="pl-10" />
              </div>
              <Button size="icon">
                <Funnel className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Empty State Message */}
      {daos.length === 0 ? (
        <article className="h-96 mt-5 flex justify-center flex-col text-center py-12">
          <Frown className="h-20 w-20 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-2xl font-semibold mb-2">No DAOs are available</h3>
          <p className="text-muted-foreground">Please check back later to see new organizations available.</p>
        </article>
      ) : (
        <article className="container mx-auto px-4 py-8">
          {/* Main Content */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {daos.map((x: any) => {
              return (
                <DaoCard
                  key={x.id}
                  daoID={x.id}
                  name={x.name}
                  description={x.description}
                  category={x.category}
                  members={x.members}
                />
              );
            })}
          </div>
        </article>
      )}
    </main>
  );
};

export default DaosPage;

"use server";

import React from "react";
import { LucideProps, Trophy, Vote, Zap } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "~~/components/ui/shadcn/card";

type Feature = {
  title: string;
  description: string;
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
};

const mainFeatures: Feature[] = [
  {
    title: "Transparent Voting",
    description: "Blockchain voting system that guarantees transparency and immutability in every decision.",
    icon: Vote,
  },
  {
    title: "Gamified Tasks",
    description: "Complete missions, contribute to the ecosystem, and gain experience while helping the community.",
    icon: Zap,
  },
  {
    title: "Sistema de Recompensas",
    description: "Recibe tokens y NFTs exclusivos por tu participación activa en la gobernanza de la DAO",
    icon: Trophy,
  },
];

export const FeatureSection: React.FC = async () => {
  return (
    <section id="features" className="py-20 px-4 bg-card/30 relative z-10 dark:bg-card-foreground/70">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 dark:text-primary-foreground">
            Main Features
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the tools that make AgoraDAO the leading platform in decentralized governance.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {mainFeatures.map((x, y) => (
            <Card
              key={y}
              className="border-border hover:shadow-lg transition-shadow dark:bg-secondary-foreground dark:border-muted-foreground dark:text-primary-foreground dark:shadow-primary-foreground/10"
            >
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 dark:bg-primary-foreground/20">
                  <x.icon className="w-6 h-6 text-primary dark:text-primary-foreground" />
                </div>
                <CardTitle>{x.title}</CardTitle>
                <CardDescription className="dark:text-primary-foreground/60">{x.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

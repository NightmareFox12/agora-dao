"use client";

import React from "react";
import { Info, Users } from "lucide-react";
import { Badge } from "~~/components/ui/shadcn/badge";
import { Button } from "~~/components/ui/shadcn/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~~/components/ui/shadcn/card";

const categoryColors = {
  DeFi: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  Gaming: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  "Social Impact": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  Infrastructure: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  Energy: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  "Creator Economy": "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
} as const;

type DaoCardProps = {
  daoID: number;
  name: string;
  description: string;
  category: string;
  members: number;
};

export const DaoCard: React.FC<DaoCardProps> = ({ daoID, name, description, category, members }) => {
  // const IconComponent = icon;

  return (
    <Card className="flex flex-col transition-all hover:shadow-lg dark:bg-accent-foreground dark:border-muted-foreground dark:hover:shadow-muted-foreground">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              {/* <IconComponent className="h-6 w-6 text-primary" /> */}
            </div>
            <div>
              <CardTitle className="text-lg dark:text-primary-foreground">{name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Users className="h-3 w-3 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{members.toLocaleString()} miembros</span>
              </div>
            </div>
          </div>
          <Badge className="dark:bg-primary-foreground dark:text-primary">#{daoID}</Badge>
        </div>
        <Badge variant="secondary" className={`w-fit ${categoryColors[category as keyof typeof categoryColors]}`}>
          {category}
        </Badge>
      </CardHeader>

      <CardContent className="flex-1">
        <CardDescription className="text-sm leading-relaxed">{description}</CardDescription>
      </CardContent>

      <CardFooter>
        <div className="w-full flex items-center justify-between gap-1 md:gap-1.5">
          <Button
            className="flex-1 dark:bg-primary-foreground dark:text-primary dark:hover:bg-primary-foreground/80"
            size="sm"
          >
            Unirse a la DAO
          </Button>
          <Button
            className="dark:bg-primary-foreground dark:text-primary dark:hover:bg-primary-foreground/80"
            size="sm"
          >
            <Info className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

"use client";

import React from "react";
import { Info, Users } from "lucide-react";
import { useTheme } from "next-themes";
import { Badge } from "~~/components/ui/shadcn/badge";
import { Button } from "~~/components/ui/shadcn/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~~/components/ui/shadcn/card";

const darkCategoryColors = {
  DeFi: "bg-blue-900 text-blue-300",
  Gaming: "bg-purple-900 text-purple-300",
  "Social Impact": "bg-green-900 text-green-300",
  Infrastructure: "bg-orange-900 text-orange-300",
  Energy: "bg-yellow-900 text-yellow-300",
  "Creator Economy": "bg-pink-900 text-pink-300",
} as const;

const lightCategoryColors = {
  DeFi: "bg-blue-100 text-blue-800",
  Gaming: "bg-purple-100 text-purple-800",
  "Social Impact": "bg-green-100 text-green-800",
  Infrastructure: "bg-orange-100 text-orange-800",
  Energy: "bg-yellow-100 text-yellow-800",
  "Creator Economy": "bg-pink-100 text-pink-800",
} as const;

type DaoCardProps = {
  daoID: number;
  name: string;
  description: string;
  category: string;
  members: number;
};

export const DaoCard: React.FC<DaoCardProps> = ({ daoID, name, description, category, members }) => {
  const { resolvedTheme } = useTheme();

  //consts
  const isDarkMode = (resolvedTheme ?? "light") === "dark";

  return (
    <Card className="flex flex-col transition-all hover:shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              {/* <IconComponent className="h-6 w-6 text-primary" /> */}
            </div>
            <div>
              <CardTitle className="text-lg ">{name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Users className="h-3 w-3 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{members.toLocaleString()} miembros</span>
              </div>
            </div>
          </div>
          <Badge>#{daoID}</Badge>
        </div>
        <Badge
          variant="secondary"
          className={`w-fit ${
            isDarkMode
              ? darkCategoryColors[category as keyof typeof darkCategoryColors]
              : lightCategoryColors[category as keyof typeof lightCategoryColors]
          }`}
        >
          {category}
        </Badge>
      </CardHeader>

      <CardContent className="flex-1">
        <CardDescription className="text-sm leading-relaxed">{description}</CardDescription>
      </CardContent>

      <CardFooter>
        <div className="w-full flex items-center justify-between gap-1 md:gap-1.5">
          <Button className="flex-1 " size="sm">
            Unirse a la DAO
          </Button>
          <Button size="sm">
            <Info className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

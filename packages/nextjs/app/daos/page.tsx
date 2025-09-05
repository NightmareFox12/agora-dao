import { Building, Coins, Gamepad2, Heart, Info, Search, Users, Zap } from "lucide-react";
import { Badge } from "~~/components/ui/shadcn/badge";
import { Button } from "~~/components/ui/shadcn/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~~/components/ui/shadcn/card";
import { Input } from "~~/components/ui/shadcn/input";

// Datos de ejemplo de DAOs
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

const categoryColors = {
  DeFi: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  Gaming: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  "Social Impact": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  Infrastructure: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  Energy: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  "Creator Economy": "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
};

export default function DaosPage() {
  return (
    <main className="min-h-screen bg-background dark:bg-foreground">
      {/* Header */}
      <header className="border-b bg-card dark:bg-accent-foreground dark:border-muted-foreground">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-balance dark:text-primary-foreground">DAOs Disponibles</h1>
              <p className="text-muted-foreground mt-2 dark:text-shadow-primary">
                Descubre y únete a organizaciones autónomas descentralizadas
              </p>
            </div>
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar DAOs..."
                className="pl-10 dark:bg-accent-foreground dark:border-muted-foreground"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {daos.map(dao => {
            const IconComponent = dao.icon;
            return (
              <Card
                key={dao.id}
                className="flex flex-col transition-all hover:shadow-lg dark:bg-accent-foreground dark:border-muted-foreground dark:hover:shadow-muted-foreground"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg dark:text-primary-foreground">{dao.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{dao.members.toLocaleString()} miembros</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className={`w-fit ${categoryColors[dao.category as keyof typeof categoryColors]}`}
                  >
                    {dao.category}
                  </Badge>
                </CardHeader>

                <CardContent className="flex-1">
                  <CardDescription className="text-sm leading-relaxed">{dao.description}</CardDescription>
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
          })}
        </div>

        {/* Empty State Message */}
        {daos.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay DAOs disponibles</h3>
            <p className="text-muted-foreground">Vuelve más tarde para ver nuevas organizaciones disponibles.</p>
          </div>
        )}
      </main>
    </main>
  );
}

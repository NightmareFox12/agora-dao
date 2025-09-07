"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleQuestionMarkIcon, Plus, Rocket } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import RotatingText from "~~/components/ui/RotatingText";
import { Button } from "~~/components/ui/shadcn/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~~/components/ui/shadcn/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~~/components/ui/shadcn/form";
import { Input } from "~~/components/ui/shadcn/input";
import { Label } from "~~/components/ui/shadcn/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~~/components/ui/shadcn/select";
import { Skeleton } from "~~/components/ui/shadcn/skeleton";
import { Switch } from "~~/components/ui/shadcn/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "~~/components/ui/shadcn/tooltip";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { useBreakpoint } from "~~/hooks/useBreakpoint";
import { DaoSchema } from "~~/lib/schemes/dao.scheme";

export const CreateDaoDialog: React.FC = () => {
  const { isMd } = useBreakpoint();

  // Form
  const daoForm = useForm<z.infer<typeof DaoSchema>>({
    resolver: zodResolver(DaoSchema),
    defaultValues: {
      name: "",
      description: "",
      categories: "",
      isPublic: true,
    },
  });

  //Smart contract
  const { data: daoCategories, isLoading: daoCategoriesLoading } = useScaffoldReadContract({
    contractName: "AgoraDaoFabric",
    functionName: "getAllDaoCategories",
  });

  const onSubmit = (data: z.infer<typeof DaoSchema>) => {
    console.log(data);
  };

  return (
    <Dialog>
      {/* Dialog button */}
      <div className="flex justify-center p-3">
        <DialogTrigger asChild>
          <Button size={isMd ? "lg" : "sm"}>
            <Plus className="w-4 h-4" />

            <RotatingText
              texts={["Create DAO", "Launch DAO", "Descentralize Now", "Start DAO"]}
              mainClassName="px-2 sm:px-2 md:px-3 overflow-hidden  justify-center rounded-lg"
              staggerFrom={"last"}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-120%" }}
              staggerDuration={0.025}
              splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
              elementLevelClassName="text-primary-foreground"
              transition={{ type: "tween", damping: 30, stiffness: 400 }}
              rotationInterval={5000}
            />
          </Button>
        </DialogTrigger>
      </div>

      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription className="">
            This action cannot be undone. This will permanently delete your account and remove your data from our
            servers.
          </DialogDescription>
        </DialogHeader>

        <Form {...daoForm}>
          <form onSubmit={daoForm.handleSubmit(onSubmit)} className=" space-y-5">
            {/* Name */}
            <FormField
              control={daoForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Name <span className="text-destructive font-bold text-bold">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  {/* <FormDescription>This is your public display name.</FormDescription> */}
                  <FormMessage className="-my-1" />
                </FormItem>
              )}
            />
            {/* Description */}
            <FormField
              control={daoForm.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Description <span className="text-destructive font-bold text-bold">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormMessage className="-my-1" />
                </FormItem>
              )}
            />

            {/* Categories */}
            {daoCategoriesLoading || daoCategories === undefined ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <FormField
                control={daoForm.control}
                name="categories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Categories <span className="text-destructive font-bold text-bold">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Choose a category" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {daoCategories.map((x, y) => (
                          <SelectItem key={y} value={x}>
                            {x.toString().toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="-my-1" />
                  </FormItem>
                )}
              />
            )}

            {/* Is Public */}
            <FormField
              control={daoForm.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Dao Visibility
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button type="button" size="icon" variant="ghost">
                          <CircleQuestionMarkIcon className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>In any public DAO, anyone can join and help the growth of the community.</p>

                        <p>
                          A private DAO can only join those users who have the link{" "}
                          <b>(private DAO will not appear in the search engine)</b>
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </FormLabel>
                  <FormControl>
                    <div className="flex justify-center gap-2">
                      <Label htmlFor="airplane-mode">{field.value ? "Public DAO" : "Private DAO"}</Label>
                      <Switch checked={field.value} onCheckedChange={value => field.onChange(value)} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">
                <Rocket className="w-4 h-4" /> Launch DAO
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

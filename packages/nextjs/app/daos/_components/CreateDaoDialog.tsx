"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleQuestionMarkIcon, Plus, Rocket, Trash, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import RotatingText from "~~/components/ui/RotatingText";
import { Button } from "~~/components/ui/shadcn/button";
import {
  Dialog,
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
import { Progress } from "~~/components/ui/shadcn/progress";
import { ScrollArea } from "~~/components/ui/shadcn/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~~/components/ui/shadcn/select";
import { Skeleton } from "~~/components/ui/shadcn/skeleton";
import { Switch } from "~~/components/ui/shadcn/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "~~/components/ui/shadcn/tooltip";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { useBreakpoint } from "~~/hooks/useBreakpoint";
import { DaoSchema } from "~~/lib/schemes/dao.scheme";

export const CreateDaoDialog: React.FC = () => {
  const { isMd } = useBreakpoint();

  //states
  const [loadImage, setLoadImage] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  // Form
  const daoForm = useForm<z.infer<typeof DaoSchema>>({
    resolver: zodResolver(DaoSchema),
    defaultValues: {
      name: "",
      description: "",
      categories: "",
      logo: undefined,
      isPublic: true,
    },
  });

  //Subscriptions
  const logoFile = daoForm.watch("logo");

  //Smart contract
  const { data: daoCategories, isLoading: daoCategoriesLoading } = useScaffoldReadContract({
    contractName: "AgoraDaoFabric",
    functionName: "getAllDaoCategories",
  });

  //functions
  const isUploadFormImage = async (e: ChangeEvent<HTMLInputElement>) => {
    setLoadImage(true);
    const file = e.target.files?.[0];
    if (!file) {
      setLoadImage(false);
      return;
    }

    setLoadImage(false);

    if (file.size >= 1024 * 1024) {
      daoForm.setError("logo", { message: "The image is greater than 1MB" });
      return null;
    }

    daoForm.clearErrors("logo");
    return file;
  };

  const onSubmit = (data: z.infer<typeof DaoSchema>) => {
    console.log(data);
  };

  //effects
  useEffect(() => {
    if (!loadImage) return;
    setProgress(0);
    daoForm.setValue("logo", undefined);
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + 2;
        return next >= 100 ? 100 : next;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [daoForm, loadImage]);

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

      <DialogContent className="p-3">
        <ScrollArea className="h-[500px] p-1 px-1 mt-2.5">
          <DialogHeader>
            <DialogTitle>Create your DAO!</DialogTitle>
            <DialogDescription>
              Once you have completed all the required fields press the &quot;Launch DAO&quot; button.
            </DialogDescription>
          </DialogHeader>

          <Form {...daoForm}>
            <form onSubmit={daoForm.handleSubmit(onSubmit)} className="space-y-5 px-1">
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

              {/* Logo */}
              <FormField
                control={daoForm.control}
                name="logo"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="flex justify-between items-center">
                      Logo
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button type="button" size="icon" variant="ghost">
                            <CircleQuestionMarkIcon className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Choose the logo that your DAO will represent. This field is optional and can be modified
                            later.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <FormControl>
                      <div className="relative h-60 bg-accent rounded-lg flex flex-col items-center justify-center overflow-hidden mx-2 border">
                        <input
                          type="file"
                          onChange={async e => {
                            const file = await isUploadFormImage(e);
                            if (file !== null) field.onChange(file);
                          }}
                          accept=".jpeg,.png,.jpg"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                        />

                        {logoFile !== undefined ? (
                          <div className="relative w-full h-auto overflow-hidden">
                            {
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={URL.createObjectURL(logoFile)}
                                alt="logo DAO"
                                className="w-full h-auto object-cover block z-10"
                                style={{ position: "relative" }}
                              />
                            }

                            {/* Botón */}
                            <div className="absolute top-2 right-2 z-30">
                              <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                onClick={() => daoForm.setValue("logo", undefined)}
                                className="hover:bg-destructive/80 hover:scale-[0.90] transition-all delay-75"
                              >
                                <Trash />
                              </Button>
                            </div>
                          </div>
                        ) : !loadImage ? (
                          <div
                            className={`absolute inset-0 flex flex-col justify-center items-center pointer-events-none z-10  ${fieldState.error ? "text-destructive" : ""}`}
                          >
                            <Upload className="w-10 h-10" />
                            <p className="my-0 font-semibold">Choose or drag an image</p>
                            <span className="font-semibold">The image must be less than 1 MB</span>
                            <span className="text-center text-sm">
                              It is recommended that the appearance of the image be 100x100
                            </span>
                          </div>
                        ) : (
                          <div className="w-full h-full px-4 flex justify-center items-center">
                            <Progress value={progress} />
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage className="-my-1 ml-2" />
                  </FormItem>
                )}
              />

              {/* Is Public */}
              <FormField
                control={daoForm.control}
                name="isPublic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="w-full flex justify-between">
                      <div>
                        Dao Visibility <span className="text-destructive font-bold text-bold">*</span>
                      </div>
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
                <div className="w-full flex justify-center gap-6 mt-4">
                  <Button type="button" onClick={() => daoForm.reset()} variant="destructive">
                    <Trash className="w-4 h-4" />
                    Clear all
                  </Button>
                  <Button type="submit">
                    <Rocket className="w-4 h-4" /> Launch DAO
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

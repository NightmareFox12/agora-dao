import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~~/components/ui/shadcn/form";
import { Input } from "~~/components/ui/shadcn/input";
import { DaoSchema } from "~~/lib/schemes/dao.scheme";

export const CreateDaoDialog: React.FC = () => {
  // Form
  const daoForm = useForm<z.infer<typeof DaoSchema>>({
    resolver: zodResolver(DaoSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = (data: z.infer<typeof DaoSchema>) => {
    console.log(data);
  };

  return (
    <Dialog>
      {/* Dialog button */}
      <DialogTrigger asChild>
        <div className="fixed bottom-0 right-0 pr-2 mb-16">
          <Button
            className="dark:bg-primary-foreground dark:text-primary dark:hover:bg-primary-foreground/80"
            size="lg"
          >
            <Plus className="w-4 h-4" />
            Create DAO
          </Button>
        </div>
      </DialogTrigger>

      <DialogContent className="dark:bg-secondary-foreground dark:border-muted-foreground dark:text-primary-foreground">
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription className="dark:text-primary-foreground/80">
            This action cannot be undone. This will permanently delete your account and remove your data from our
            servers.
          </DialogDescription>
        </DialogHeader>

        <Form {...daoForm}>
          <form onSubmit={daoForm.handleSubmit(onSubmit)} className=" space-y-2">
            <FormField
              control={daoForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormDescription>This is your public display name.</FormDescription>
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
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

import { useMemo } from "react";
import { UserJoinedTable } from "./DaoDetailsEvents/userJoined";
import { UserJoinedEvent } from "./DaoDetailsEvents/userJoined/userJoinedColumns";
import { Image, Info } from "lucide-react";
import { Badge } from "~~/components/ui/shadcn/badge";
import { Button } from "~~/components/ui/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~~/components/ui/shadcn/dialog";
import { ScrollArea, ScrollBar } from "~~/components/ui/shadcn/scroll-area";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth/useScaffoldEventHistory";

type DaoDetailsDialogProps = {
  daoID: bigint;
  daoAddress: string;
  name: string;
  description: string;
  imageUri: string;
  creationDate: bigint;
};

export const DaoDetailsDialog: React.FC<DaoDetailsDialogProps> = ({
  daoID,
  daoAddress,
  name,
  description,
  imageUri,
  creationDate,
}) => {
  //constans
  const parsedDate = new Date(parseInt((creationDate * 1000n).toString())).toISOString().split("T")[0];

  //Smart contract
  const {
    data: userJoined,
    // isLoading: isLoadingEvents,
    // error: errorReadingEvents,
  } = useScaffoldEventHistory({
    contractName: "AgoraDao",
    eventName: "UserJoined",
    contractAddress: daoAddress,
    fromBlock: 0n,
    watch: true,
    // filters: { greetingSetter: "0x9eB2C4866aAe575bC88d00DE5061d5063a1bb3aF" },
    blockData: true,
    transactionData: true,
    receiptData: true,
  });

  //TODO: agregar tabla de eventos con un tab para (unidos,votaciones o mas cosas)

  //memos
  const userJoinedEvent = useMemo(() => {
    if (!userJoined || userJoined.length === 0) return [];

    const data: UserJoinedEvent[] = [];

    userJoined.map(x => {
      console.log(x);
      data.push(x as unknown as UserJoinedEvent);
    });

    return data;
  }, [userJoined]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">
          <Info className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{name} Details</DialogTitle>
          <DialogDescription className="break-all">{description}</DialogDescription>
        </DialogHeader>
        <article className="flex flex-col">
          <div className="flex justify-between my-2">
            <span className="text-sm text-muted-foreground">Created on: {parsedDate}</span>
            <Badge>ID #{daoID}</Badge>
          </div>

          <div className="flex justify-center items-center flex-col">
            {imageUri.length > 4 ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={`https://ipfs.io/ipfs/${imageUri}`} alt={name} className="object-cover w-32 h-32" />
            ) : (
              // eslint-disable-next-line jsx-a11y/alt-text
              <Image className="w-12 h-12" />
            )}
            <span className="text-sm text-muted-foreground">Logo</span>
          </div>

          <ScrollArea className="max-w-md">
            <UserJoinedTable data={userJoinedEvent} />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </article>
      </DialogContent>
    </Dialog>
  );
};

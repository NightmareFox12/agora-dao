import dynamic from "next/dynamic";
import { Image, Info } from "lucide-react";
import { Button } from "~~/components/ui/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~~/components/ui/shadcn/dialog";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth/useScaffoldEventHistory";

type DaoDetailsDialogProps = {
  daoID: bigint;
  daoAddress: string;
  name: string;
  description: string;
  imageUri: string;
  creationDate: bigint;
};

//dinamycs
const NoSSRBadge = dynamic(() => import("~~/components/ui/shadcn/badge").then(module => module.Badge), { ssr: false });

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

  console.log(userJoined);
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
        <article>
          <div className="flex justify-between my-2">
            <span className="text-sm text-muted-foreground">Created on: {parsedDate}</span>
            <NoSSRBadge>ID #{daoID}</NoSSRBadge>
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

          {/* meter una tabla con los ultimos unidos, leyendo un buen event  */}
        </article>
      </DialogContent>
    </Dialog>
  );
};

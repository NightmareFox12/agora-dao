import { ColumnDef } from "@tanstack/react-table";

export type UserJoinedEvent = {
  address: string;
  args: { user: string; userID: bigint };
  blockData: { timestamp: bigint };
  blockHash: string;
  blockNumber: bigint;
  eventName: "UserJoined";
  transactionHash: string;
};

export const columns: ColumnDef<UserJoinedEvent>[] = [
  {
    accessorKey: "address",
    header: "User",
  },
  {
    accessorKey: "blockData.timestamp",
    header: "Date",
  },
  {
    accessorKey: "transactionHash",
    header: "Hash",
  },
  {
    accessorKey: "blockNumber",
    header: "Block",
  },
];

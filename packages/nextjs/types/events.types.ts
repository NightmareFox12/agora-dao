export type UserJoinedEvent = {
  block: {
    block_hash: string;
    timestamp: number;
  }
  parsedArgs: { user: `0x${string}`; user_ID: bigint };

};

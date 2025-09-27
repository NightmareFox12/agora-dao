type BaseEvent = {
  block: {
    block_hash: string;
    timestamp: number;
  };
};

export type UserJoinedEvent = BaseEvent & {
  parsedArgs: { user: `0x${string}`; user_ID: bigint };
};

export type RoleCreatedEvent = BaseEvent & {
  parsedArgs: {
    role_ID: bigint;
    role_name: string;
    assigned_by: `0x${string}`;
    assigned_to: `0x${string}`;
  };
};

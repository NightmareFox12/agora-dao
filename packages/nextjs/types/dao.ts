export interface IDao {
  dao_id: bigint;
  dao_address: bigint;
  creator: bigint;
  name: string;
  description: string;
  category: string;
  image_URI: string;
  creation_timestamp: bigint;
}
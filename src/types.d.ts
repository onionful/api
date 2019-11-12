import { User as BaseUser } from 'auth0';

export interface CollectionFiels {
  type: 'string' | 'number' | 'date';
  order: number;
}

export interface Collection {
  space: string;
  id: string;
  name: string;
  description: string;
  fields: CollectionFiels[];
}

export interface Content {
  id: string;
  key: string;
  data: any;
  createdBy: string;
}

interface AppMetadata {}

interface UserMetadata {}

export interface User extends BaseUser<AppMetadata, UserMetadata> {}

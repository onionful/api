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

export interface User {
  id: string;
}

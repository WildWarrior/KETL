export interface Column {
  id: string;
  name: string;
  type: string;
}

export interface Schema {
  id: string;
  name: string;
  columns: Column[];
}
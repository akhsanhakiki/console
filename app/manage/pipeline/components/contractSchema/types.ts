export type SchemaDataType =
  | "string"
  | "number"
  | "boolean"
  | "date"
  | "object"
  | "array";

export interface SchemaField {
  id: string;
  name: string;
  description: string;
  type: SchemaDataType;
  children?: SchemaField[];
  boundKeys?: string[]; // IDs of document schema keys that are bound to this field
}

export interface ContractSchema {
  id: string;
  fields: SchemaField[];
}

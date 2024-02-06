export type PrimitiveTypes = unknown;

export type PrimitiveObject = { [key: string]: PrimitiveTypes };

interface FirestoreQueryData {
  key: string;
  operator: FirebaseFirestore.WhereFilterOp;
}

type FirestoreQuery<T extends { [field: string]: unknown }> = {
  [J in keyof T]?: FirestoreQueryData;
};

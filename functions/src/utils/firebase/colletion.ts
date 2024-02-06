type FirestoreCollection = {
  key: string;
  subCollections?: { [field: string]: FirestoreCollection };
};

export const FirestoreCollections = {
  habit: {
    key: "HABIT",
    subCollections: {
      history: {
        key: "HISTORY",
      },
      log: {
        key: "LOG",
      },
    },
  },
} as const satisfies { [field: string]: FirestoreCollection };

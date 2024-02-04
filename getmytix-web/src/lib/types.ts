export type Domain<T> = Omit<T, "_id"> & { id: string };

export type Maybe<T> = T | null;

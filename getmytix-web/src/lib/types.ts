export type Domain<T> = Omit<T, "_id"> & { id: string };

export type Optional<T> = T | null;

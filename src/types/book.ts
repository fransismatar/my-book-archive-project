export type Book = {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  isFavorite: boolean;
};

export type BookFormData = {
  title: string;
  author: string;
  description: string;
  coverImage: string;
};
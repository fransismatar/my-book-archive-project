import {
  Heart,
  LoaderCircle,
  Pencil,
  Trash2,
} from "lucide-react";

import type { Book } from "../types/book";

type BookCardProps = {
  book: Book;
  isUpdatingFavorite: boolean;
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
  onToggleFavorite: (book: Book) => void;
};

const fallbackImage =
  "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=700&q=80";

function BookCard({
  book,
  isUpdatingFavorite,
  onEdit,
  onDelete,
  onToggleFavorite,
}: BookCardProps) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl">
      <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
        <img
          src={book.coverImage}
          alt={`Cover of ${book.title}`}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          onError={(event) => {
            event.currentTarget.src = fallbackImage;
          }}
        />

        <button
          type="button"
          onClick={() => onToggleFavorite(book)}
          disabled={isUpdatingFavorite}
          className={`absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full shadow-lg transition ${
            book.isFavorite
              ? "bg-rose-500 text-white hover:bg-rose-600"
              : "bg-white/90 text-slate-700 hover:bg-white hover:text-rose-500"
          } disabled:cursor-not-allowed disabled:opacity-60`}
          aria-label={
            book.isFavorite
              ? "Remove from favorites"
              : "Add to favorites"
          }
        >
          {isUpdatingFavorite ? (
            <LoaderCircle size={20} className="animate-spin" />
          ) : (
            <Heart
              size={21}
              className={book.isFavorite ? "fill-current" : ""}
            />
          )}
        </button>
      </div>

      <div className="p-5">
        <h2 className="line-clamp-2 text-xl font-bold text-slate-900">
          {book.title}
        </h2>

        <p className="mt-2 text-sm font-semibold text-violet-600">
          By {book.author}
        </p>

        {book.description ? (
          <p className="mt-4 line-clamp-3 min-h-[72px] text-sm leading-6 text-slate-500">
            {book.description}
          </p>
        ) : (
          <p className="mt-4 min-h-[72px] text-sm italic text-slate-400">
            No description available.
          </p>
        )}

        <div className="mt-5 flex gap-3 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={() => onEdit(book)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-100 px-3 py-3 text-sm font-bold text-slate-700 transition hover:bg-violet-100 hover:text-violet-700"
          >
            <Pencil size={17} />
            Edit
          </button>

          <button
            type="button"
            onClick={() => onDelete(book)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-50 px-3 py-3 text-sm font-bold text-red-600 transition hover:bg-red-100"
          >
            <Trash2 size={17} />
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}

export default BookCard;